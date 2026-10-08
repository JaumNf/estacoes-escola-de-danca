import { NextRequest, NextResponse } from 'next/server';
import {
  AULAS,
  CHECKOUT,
  EDICAO,
  aulaPorId,
  calcularOrcamento,
  ehVendavel,
  formatarReais,
  type Formato,
} from '@/lib/intensivo';
import { criarLinkDePagamento, emCentavos, urlPublica } from '@/lib/pagamento';

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

/**
 * Protocolo curto e legível em voz alta, sem caracteres que se confundem
 * (0/O, 1/I/L). É o que a pessoa cita no WhatsApp e o que identifica a
 * transferência no extrato.
 */
function gerarProtocolo(): string {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  const aleatorio = new Uint8Array(6);
  crypto.getRandomValues(aleatorio);
  for (const byte of aleatorio) sufixo += alfabeto[byte % alfabeto.length];
  return `EST-${sufixo}`;
}

/** Deixa só os dígitos e confere se parece um celular brasileiro. */
function normalizarWhatsapp(bruto: string): string | null {
  const digitos = bruto.replace(/\D/g, '');
  const semDdi = digitos.startsWith('55') && digitos.length > 11 ? digitos.slice(2) : digitos;
  // DDD de dois dígitos + 8 ou 9 dígitos de número.
  if (semDdi.length < 10 || semDdi.length > 11) return null;
  return `55${semDdi}`;
}

function limparNome(bruto: string): string {
  return bruto.replace(/\s+/g, ' ').trim().slice(0, 80);
}

function erro(mensagem: string, status: number) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function POST(request: NextRequest) {
  if (!EDICAO.ativa) {
    return erro('As inscrições desta edição não estão abertas.', 409);
  }

  const webhook = process.env.INSCRICOES_WEBHOOK_URL;
  const token = process.env.INSCRICOES_TOKEN;
  if (!webhook || !token) {
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

  const whatsapp1 = normalizarWhatsapp(String(dados.get('whatsapp1') ?? ''));
  if (!whatsapp1) return erro('Confira o WhatsApp: use DDD + número, como (67) 99263-0948.', 400);

  let nome2 = '';
  let whatsapp2 = '';
  if (formato === 'dupla') {
    nome2 = limparNome(String(dados.get('nome2') ?? ''));
    if (nome2.length < 3) return erro('Na inscrição em dupla, escreva o nome das duas pessoas.', 400);

    const normalizado = normalizarWhatsapp(String(dados.get('whatsapp2') ?? ''));
    if (!normalizado) return erro('Confira o WhatsApp da segunda pessoa.', 400);
    whatsapp2 = normalizado;
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

  const corpo = {
    token,
    protocolo,
    enviadoEm: new Date().toISOString(),
    edicao: EDICAO.nome,
    lote: orcamento.lote.nome,
    formato: formato === 'dupla' ? 'Dupla' : 'Individual',
    nome1,
    whatsapp1,
    nome2,
    whatsapp2,
    aulas: descricaoAulas,
    quantidadeAulas: orcamento.quantidadeAulas,
    baile: orcamento.baileEscolhido
      ? orcamento.baileDeBrinde
        ? 'Sim (brinde das 4 aulas)'
        : 'Sim (pago)'
      : 'Não',
    subtotalAulas: orcamento.subtotalAulas,
    subtotalBaile: orcamento.subtotalBaile,
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
  };

  try {
    // O Apps Script responde em segundos; sem teto, uma indisponibilidade do
    // Google deixaria a pessoa olhando o botão girar.
    const resposta = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(20_000),
      // O Apps Script responde 302 para o domínio de conteúdo do Google.
      redirect: 'follow',
    });

    const texto = await resposta.text();
    if (!resposta.ok) {
      console.error('[inscricao] planilha respondeu', resposta.status, texto.slice(0, 500));
      return erro(
        'Não conseguimos registrar sua inscrição agora. Manda no WhatsApp que a gente resolve na hora.',
        502,
      );
    }

    // O script devolve JSON; se vier HTML, algo está mal configurado.
    let resultado: { ok?: boolean; erro?: string; comprovanteUrl?: string } = {};
    try {
      resultado = JSON.parse(texto);
    } catch {
      console.error('[inscricao] resposta não-JSON da planilha:', texto.slice(0, 500));
      return erro(
        'Não conseguimos registrar sua inscrição agora. Manda no WhatsApp que a gente resolve na hora.',
        502,
      );
    }

    if (!resultado.ok) {
      console.error('[inscricao] planilha recusou:', resultado.erro);
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
              }${orcamento.baileEscolhido ? ' + baile' : ''} (${protocolo})`,
            },
          ],
          redirectUrl: urlPublica(`/cursos-intensivos/inscricao/obrigado?protocolo=${protocolo}`),
          webhookUrl: urlPublica('/api/pagamento/webhook'),
          cliente: { name: nome1, phone_number: whatsapp1 },
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
  } catch (falha) {
    console.error('[inscricao] falha ao falar com a planilha:', falha);
    return erro(
      'Não conseguimos registrar sua inscrição agora. Manda no WhatsApp que a gente resolve na hora.',
      502,
    );
  }
}
