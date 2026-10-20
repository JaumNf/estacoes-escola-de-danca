import { NextRequest, NextResponse } from 'next/server';
import {
  AULAS,
  CHECKOUT,
  EDICAO,
  ENDERECO_COBRANCA,
  emailValido,
  aulaPorId,
  calcularOrcamento,
  ehVendavel,
  formatarReais,
  whatsappComDdi,
  type Formato,
} from '@/lib/intensivo';
import { criarLinkDePagamento, emCentavos, urlPublica } from '@/lib/pagamento';
import {
  credenciaisDaPlanilha,
  gerarProtocolo,
  gravarNaPlanilha,
  limparNome,
} from '@/lib/planilha';

/**
 * Recebe uma inscrição do Curso Intensivo e repassa para a planilha do Google.
 *
 * Por que passar por aqui em vez de o navegador falar direto com o Google:
 *   • a URL do Apps Script e o token ficam no servidor, fora do bundle;
 *   • o total é recalculado aqui — o navegador manda o que quiser, mas o que
 *     vai para a planilha é o preço de tabela das aulas escolhidas;
 *   • sem CORS, sem preflight, e a mensagem de erro fica sob nosso controle.
 *
 * Variáveis de ambiente (veja .env.example):
 *   INSCRICOES_WEBHOOK_URL  URL do Web App do Apps Script (/exec)
 *   INSCRICOES_TOKEN        segredo combinado com o script
 */

/** Teto do comprovante depois da compressão feita no navegador. */
const TAMANHO_MAXIMO_COMPROVANTE = 3 * 1024 * 1024;

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

/** O protocolo, o nome limpo e a gravação moram em `lib/planilha.ts`: a venda
 *  do ingresso do baile usa exatamente os mesmos. */

function erro(mensagem: string, status: number) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function POST(request: NextRequest) {
  if (!EDICAO.ativa) {
    return erro('As inscrições desta edição não estão abertas.', 409);
  }

  const credenciais = credenciaisDaPlanilha();
  if (!credenciais) {
    // Sem destino configurado, dizer "deu tudo certo" seria perder a inscrição.
    return erro(
      'O envio automático está fora do ar. Mande seus dados pelo WhatsApp que a gente garante sua vaga na hora.',
      503,
    );
  }

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return erro('Não conseguimos ler o formulário. Tente de novo.', 400);
  }

  // ── formato ───────────────────────────────────────────────────────────────
  const formatoBruto = String(dados.get('formato') ?? '');
  if (formatoBruto !== 'individual' && formatoBruto !== 'dupla') {
    return erro('Escolha entre inscrição individual ou em dupla.', 400);
  }
  const formato = formatoBruto as Formato;

  // ── nomes e WhatsApp ──────────────────────────────────────────────────────
  const nome1 = limparNome(String(dados.get('nome1') ?? ''));
  if (nome1.length < 3) return erro('Escreva o nome completo da primeira pessoa.', 400);

  const whatsapp1 = whatsappComDdi(String(dados.get('whatsapp1') ?? ''));
  if (!whatsapp1) return erro('Confira o WhatsApp: use DDD + número, como (67) 99263-0948.', 400);

  // O e-mail existe só para a InfinitePay aceitar os dados de contato prontos
  // e pular a etapa dela. Sem ele a inscrição vale do mesmo jeito — a pessoa
  // apenas redigita o contato no checkout.
  //
  // Por isso ele NÃO é obrigatório aqui, embora o formulário o peça: recusar
  // uma inscrição por causa de um ganho de conforto é troca ruim. Em
  // 19/10/2026 isto chegou a derrubar um envio real — quem estava com a página
  // aberta desde antes do deploy mandou o formulário antigo, sem o campo, e
  // levou um 400 na cara do botão "Pagar".
  const emailBruto = String(dados.get('email1') ?? '').trim().slice(0, 120);
  const email1 = emailValido(emailBruto) ? emailBruto : '';

  let nome2 = '';
  // A dupla se inscreve junto, então um contato basta — quem preenche
  // responde pelos dois. O segundo WhatsApp deixou de ser pedido no
  // formulário; se vier (de uma página antiga, por exemplo), é aproveitado.
  let whatsapp2 = '';
  if (formato === 'dupla') {
    nome2 = limparNome(String(dados.get('nome2') ?? ''));
    if (nome2.length < 3) return erro('Na inscrição em dupla, escreva o nome das duas pessoas.', 400);

    whatsapp2 = whatsappComDdi(String(dados.get('whatsapp2') ?? '')) ?? '';
  }

  // ── aulas ─────────────────────────────────────────────────────────────────
  let idsRecebidos: unknown;
  try {
    idsRecebidos = JSON.parse(String(dados.get('aulas') ?? '[]'));
  } catch {
    return erro('Não conseguimos ler as aulas escolhidas. Tente de novo.', 400);
  }
  if (!Array.isArray(idsRecebidos)) {
    return erro('Não conseguimos ler as aulas escolhidas. Tente de novo.', 400);
  }

  // Só ids que existem na edição e são vendáveis, sem repetição e na ordem
  // do cronograma. Intervalo não é item de venda.
  const escolhidos = new Set(
    idsRecebidos.filter((id): id is string => typeof id === 'string'),
  );
  const ids = AULAS.filter((aula) => escolhidos.has(aula.id) && ehVendavel(aula)).map(
    (aula) => aula.id,
  );
  if (ids.length === 0) return erro('Escolha pelo menos uma aula.', 400);

  // O preço é o de tabela, calculado aqui. O que o navegador mandou é ignorado.
  const orcamento = calcularOrcamento(ids, formato);

  // ── método de pagamento ───────────────────────────────────────────────────
  const metodo = String(dados.get('metodo') ?? '');
  if (metodo !== 'pix' && metodo !== 'credito') {
    return erro('Escolha a forma de pagamento.', 400);
  }

  // ── consentimento (LGPD) ──────────────────────────────────────────────────
  if (String(dados.get('consentimento')) !== 'true') {
    return erro('Precisamos do seu aceite para guardar seus dados e entrar em contato.', 400);
  }

  // ── caminho do pagamento ──────────────────────────────────────────────────
  // No checkout automático a pessoa paga na página da InfinitePay e a
  // confirmação chega por webhook, então não há comprovante para anexar.
  const viaCheckout =
    String(dados.get('checkout')) === 'true' && CHECKOUT.ativo && Boolean(CHECKOUT.handle);

  // ── comprovante ───────────────────────────────────────────────────────────
  const comprovante = dados.get('comprovante');
  let arquivo: { nome: string; tipo: string; base64: string } | null = null;

  if (comprovante instanceof File && comprovante.size > 0) {
    if (comprovante.size > TAMANHO_MAXIMO_COMPROVANTE) {
      return erro('O comprovante passou de 3 MB. Manda um print ou uma foto menor.', 413);
    }
    if (!TIPOS_ACEITOS.includes(comprovante.type)) {
      return erro('O comprovante precisa ser imagem (JPG, PNG) ou PDF.', 415);
    }
    const bytes = Buffer.from(await comprovante.arrayBuffer());
    arquivo = {
      nome: comprovante.name.replace(/[^\w.\-]/g, '_').slice(0, 80) || 'comprovante',
      tipo: comprovante.type,
      base64: bytes.toString('base64'),
    };
  } else if (metodo === 'pix' && !viaCheckout) {
    return erro('Anexe o comprovante do PIX para a gente confirmar sua vaga.', 400);
  }

  // ── repasse para a planilha ───────────────────────────────────────────────
  // O que se cobra é SEMPRE o preço de tabela. No crédito, quem acrescenta a
  // taxa é a InfinitePay, na página dela — mandar o valor já acrescido faria a
  // taxa ser cobrada duas vezes. Quanto a pessoa pagou de fato chega depois,
  // pelo webhook, e é ele que preenche a coluna da taxa.
  const totalCobrado = orcamento.total;
  const taxaCartao = 0;

  const protocolo = gerarProtocolo();
  const descricaoAulas = ids
    .map((id) => {
      const aula = aulaPorId(id)!;
      return `${aula.dia}/${aula.mes} ${aula.horario} — ${aula.nome} (${aula.nivel})`;
    })
    .join(' | ');

  const gravacao = await gravarNaPlanilha(credenciais, {
    protocolo,
    enviadoEm: new Date().toISOString(),
    edicao: EDICAO.nome,
    lote: orcamento.lote.nome,
    formato: formato === 'dupla' ? 'Dupla' : 'Individual',
    nome1,
    whatsapp1,
    // A planilha ainda não tem coluna de e-mail; o campo vai junto para que
    // criar a coluna no Apps Script seja a única coisa a fazer depois.
    email1,
    nome2,
    whatsapp2,
    aulas: descricaoAulas,
    quantidadeAulas: orcamento.quantidadeAulas,
    // O ingresso do baile não se vende mais aqui. O que esta coluna informa é
    // se a entrada vai franca pela faixa das aulas todas — a portaria precisa
    // disso para deixar a pessoa entrar sem ingresso na mão.
    baile: orcamento.entradaDoBaileInclusa
      ? `Entrada inclusa (${orcamento.quantidadeAulas} aulas)`
      : 'Não — ingresso à parte',
    subtotalAulas: orcamento.subtotalAulas,
    // A entrada inclusa não é cobrança de valor zero: nada é cobrado por ela.
    subtotalBaile: 0,
    percentualDesconto: orcamento.percentualDesconto,
    desconto: orcamento.desconto,
    // No crédito a taxa da operadora é repassada, então o que a pessoa paga
    // não é o preço de tabela. A planilha registra os dois.
    taxaCartao,
    total: totalCobrado,
    totalFormatado: formatarReais(totalCobrado),
    metodo: metodo === 'pix' ? 'PIX' : 'Cartão de crédito',
    // No checkout, a linha nasce "aguardando" e o webhook a promove a "Pago".
    // Gravar antes de mandar a pessoa pagar é o que impede de perder a
    // inscrição de quem desiste no meio do caminho.
    status: viaCheckout ? 'Aguardando pagamento' : 'A conferir',
    arquivo,
  });

  if (!gravacao.ok) {
    console.error('[inscricao]', gravacao.motivo);
    return erro(
      'Não conseguimos registrar sua inscrição agora. Manda no WhatsApp que a gente resolve na hora.',
      502,
    );
  }

  // A inscrição já está gravada. Agora, se for pelo checkout, criamos a
  // cobrança e devolvemos para onde mandar a pessoa.
  let checkoutUrl: string | undefined;
  if (viaCheckout) {
    try {
      const link = await criarLinkDePagamento({
        handle: CHECKOUT.handle,
        orderNsu: protocolo,
        itens: [
          {
            quantity: 1,
            price: emCentavos(totalCobrado),
            description: `${EDICAO.nome} — ${orcamento.quantidadeAulas} ${
              orcamento.quantidadeAulas === 1 ? 'aula' : 'aulas'
            } (${protocolo})`,
          },
        ],
        redirectUrl: urlPublica(`/cursos-intensivos/inscricao/obrigado?protocolo=${protocolo}`),
        webhookUrl: urlPublica('/api/pagamento/webhook'),
        // Os três juntos são o que faz a InfinitePay dar a etapa "Contato"
        // por preenchida. Faltando um, ela reabre o passo inteiro — que é o
        // comportamento antigo, aceitável, e não um erro.
        cliente: {
          name: nome1,
          phone_number: whatsapp1,
          ...(email1 ? { email: email1 } : {}),
        },
        endereco: ENDERECO_COBRANCA,
      });
      checkoutUrl = link.url;
    } catch (falha) {
      // A inscrição já foi registrada; só o pagamento automático falhou.
      // Em vez de perder a venda, o formulário cai no caminho manual.
      console.error('[inscricao] não consegui criar o link de pagamento:', falha);
    }
  }

  return NextResponse.json({
    ok: true,
    protocolo,
    // O que a pessoa pagou de verdade — no crédito, já com a taxa repassada.
    total: totalCobrado,
    totalFormatado: formatarReais(totalCobrado),
    taxaCartao,
    checkoutUrl,
  });
}
