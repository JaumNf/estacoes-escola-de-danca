import { NextRequest, NextResponse } from 'next/server';

import {
  BAILE,
  descricaoDoIngresso,
  precoDoIngresso,
  vendaAntecipadaAberta,
} from '@/lib/baile';
import { emailValido, formatarReais, whatsappComDdi, type Formato } from '@/lib/comum';
import { CHECKOUT, ENDERECO_COBRANCA } from '@/lib/intensivo';
import { criarLinkDePagamento, emCentavos, urlPublica } from '@/lib/pagamento';
import {
  credenciaisDaPlanilha,
  gerarProtocolo,
  gravarNaPlanilha,
  limparNome,
} from '@/lib/planilha';

/**
 * Vende o ingresso do baile.
 *
 * É irmã de `/api/inscricao`, não uma cópia: as duas geram o protocolo, gravam
 * na mesma planilha pelo mesmo `lib/planilha.ts` e criam a cobrança pelo mesmo
 * `lib/pagamento.ts`. A confirmação também é a mesma — o webhook de
 * `/api/pagamento/webhook` acha a linha pelo protocolo e não precisa saber se
 * ela é de aula ou de baile.
 *
 * O que muda é só o que se está vendendo, e por isso vale uma rota própria: um
 * `if` dentro da rota do intensivo misturaria dois cálculos de preço no mesmo
 * lugar, três dias antes de um curso, no arquivo que está recebendo dinheiro.
 *
 * ⚠️  O preço é SEMPRE o daqui. O que o navegador manda é ignorado de
 *     propósito: mandar o total pelo formulário seria deixar o cliente
 *     escolher quanto pagar.
 */

function erro(mensagem: string, status: number) {
  return NextResponse.json({ erro: mensagem }, { status });
}

/** O que se oferece quando a venda automática não dá — nunca um beco sem saída. */
const FALE_COM_A_GENTE =
  'A venda pelo site está indisponível agora. Chama a gente no WhatsApp que garantimos seu ingresso na hora.';

export async function POST(request: NextRequest) {
  if (!BAILE.ativo) {
    return erro('Este baile não está com venda aberta.', 409);
  }

  // O prazo é conferido aqui, no servidor, e não só na tela: a página pode
  // estar aberta desde antes do fechamento.
  if (!vendaAntecipadaAberta()) {
    return erro(
      `A venda antecipada fechou. A entrada agora é na portaria, por ${formatarReais(
        BAILE.naHora,
      )}.`,
      409,
    );
  }

  const credenciais = credenciaisDaPlanilha();
  if (!credenciais) {
    // Sem destino configurado, dizer "deu tudo certo" seria perder a venda.
    return erro(FALE_COM_A_GENTE, 503);
  }

  if (!CHECKOUT.ativo || !CHECKOUT.handle) {
    return erro(FALE_COM_A_GENTE, 503);
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
    return erro('Escolha entre ingresso individual ou para dois.', 400);
  }
  const formato = formatoBruto as Formato;

  // ── nomes e WhatsApp ──────────────────────────────────────────────────────
  const nome1 = limparNome(String(dados.get('nome1') ?? ''));
  if (nome1.length < 3) return erro('Escreva seu nome completo.', 400);

  const whatsapp1 = whatsappComDdi(String(dados.get('whatsapp1') ?? ''));
  if (!whatsapp1) return erro('Confira o WhatsApp: use DDD + número, como (67) 99263-0948.', 400);

  // O e-mail existe só para a InfinitePay aceitar o contato pronto e pular uma
  // etapa do checkout dela. Por isso NÃO é obrigatório: recusar uma venda por
  // causa de um ganho de conforto é troca ruim. É a mesma decisão de
  // /api/inscricao, tomada depois de um 400 derrubar uma inscrição real.
  const emailBruto = String(dados.get('email1') ?? '').trim().slice(0, 120);
  const email1 = emailValido(emailBruto) ? emailBruto : '';

  // No ingresso para dois, o segundo nome é só para a portaria saber quem entra.
  // Um contato basta: quem compra responde pelos dois.
  let nome2 = '';
  if (formato === 'dupla') {
    nome2 = limparNome(String(dados.get('nome2') ?? ''));
    if (nome2.length < 3) {
      return erro('No ingresso para dois, escreva o nome das duas pessoas.', 400);
    }
  }

  // ── consentimento (LGPD) ──────────────────────────────────────────────────
  if (String(dados.get('consentimento')) !== 'true') {
    return erro('Precisamos do seu aceite para guardar seus dados e entrar em contato.', 400);
  }

  // ── preço ─────────────────────────────────────────────────────────────────
  const total = precoDoIngresso(formato);
  const protocolo = gerarProtocolo();

  // A linha nasce "aguardando" e o webhook a promove a "Pago". Gravar antes de
  // mandar a pessoa pagar é o que impede de perder quem desiste no meio.
  const gravacao = await gravarNaPlanilha(credenciais, {
    protocolo,
    enviadoEm: new Date().toISOString(),
    edicao: BAILE.nome,
    lote: 'Venda antecipada',
    formato: formato === 'dupla' ? 'Dupla' : 'Individual',
    nome1,
    whatsapp1,
    email1,
    nome2,
    whatsapp2: '',
    aulas: `${BAILE.dia}/${BAILE.mes} ${BAILE.horario} — ${BAILE.nome}`,
    // Ingresso não é aula: a coluna de quantidade fica em zero de propósito,
    // e é por ela que se separa um ingresso de uma inscrição na planilha.
    quantidadeAulas: 0,
    baile: formato === 'dupla' ? 'Ingresso para dois' : 'Ingresso individual',
    subtotalAulas: 0,
    subtotalBaile: total,
    percentualDesconto: 0,
    desconto: 0,
    // Quem acrescenta a taxa do crédito é a InfinitePay, na página dela. O que
    // a pessoa pagou de fato chega depois, pelo webhook.
    taxaCartao: 0,
    total,
    totalFormatado: formatarReais(total),
    metodo: 'Checkout (PIX ou cartão)',
    status: 'Aguardando pagamento',
    arquivo: null,
  });

  if (!gravacao.ok) {
    console.error('[baile]', gravacao.motivo);
    return erro(
      'Não conseguimos registrar seu ingresso agora. Manda no WhatsApp que a gente resolve na hora.',
      502,
    );
  }

  // O ingresso já está gravado. Agora a cobrança.
  let checkoutUrl: string | undefined;
  try {
    const link = await criarLinkDePagamento({
      handle: CHECKOUT.handle,
      orderNsu: protocolo,
      itens: [
        {
          quantity: 1,
          price: emCentavos(total),
          description: `${descricaoDoIngresso(formato)} (${protocolo})`,
        },
      ],
      redirectUrl: urlPublica(`/baile/obrigado?protocolo=${protocolo}`),
      webhookUrl: urlPublica('/api/pagamento/webhook'),
      // Os três juntos são o que faz a InfinitePay dar a etapa "Contato" por
      // preenchida. Faltando um, ela reabre o passo — comportamento antigo,
      // aceitável, e não um erro.
      cliente: {
        name: nome1,
        phone_number: whatsapp1,
        ...(email1 ? { email: email1 } : {}),
      },
      endereco: ENDERECO_COBRANCA,
    });
    checkoutUrl = link.url;
  } catch (falha) {
    // O ingresso está registrado; só o pagamento automático falhou. Em vez de
    // perder a venda, o formulário manda a pessoa para o WhatsApp com o
    // protocolo na mão.
    console.error('[baile] não consegui criar o link de pagamento:', falha);
  }

  return NextResponse.json({
    ok: true,
    protocolo,
    total,
    totalFormatado: formatarReais(total),
    checkoutUrl,
  });
}
