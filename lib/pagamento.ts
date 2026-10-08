/**
 * Cliente do Checkout da InfinitePay.
 *
 * Fluxo: o site cria um link de cobrança com o valor e o protocolo da
 * inscrição, manda a pessoa para lá, e a InfinitePay avisa por webhook quando
 * o pagamento é aprovado.
 *
 * ⚠️  A API se identifica só pelo handle da InfiniteTag — não há chave secreta
 *     nem assinatura no webhook. Então o webhook NÃO é confiável sozinho:
 *     quem descobrir a URL pode mandar um "pago" falso. Por isso toda
 *     notificação é reconferida em `consultarPagamento()` antes de valer.
 *
 * Só roda no servidor: nada aqui deve ser importado por componente 'use client'.
 */

/**
 * A API de verdade. `INFINITEPAY_API_BASE` existe só para apontar os testes
 * para um servidor falso — em produção não se define essa variável.
 */
const BASE = process.env.INFINITEPAY_API_BASE || 'https://api.checkout.infinitepay.io';

/** A InfinitePay trabalha em centavos. Reais entram só na borda. */
export function emCentavos(reais: number): number {
  return Math.round(reais * 100);
}

/**
 * De onde a InfinitePay vai nos chamar de volta.
 *
 * ⚠️  Tem que ser o DOMÍNIO DE PRODUÇÃO, não o endereço do deploy.
 *     `VERCEL_URL` aponta para o deploy específico
 *     (`...-1iox2k86v-....vercel.app`), e esse endereço fica atrás do login da
 *     Vercel: a InfinitePay bate nele e recebe uma tela de autenticação, então
 *     o pagamento nunca é confirmado. Já aconteceu em 08/10/2026.
 *
 *     `VERCEL_PROJECT_PRODUCTION_URL` é o domínio de verdade e vem de graça
 *     nas variáveis de sistema da Vercel. O `VERCEL_URL` fica por último, só
 *     para não quebrar em ambientes onde ele é o único disponível.
 */
export function urlPublica(caminho: string): string {
  const daVercel = (host?: string) => (host ? `https://${host}` : '');
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    daVercel(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    daVercel(process.env.VERCEL_URL) ||
    'http://localhost:3000';
  return new URL(caminho, base).toString();
}

export interface ItemDaCobranca {
  quantity: number;
  /** Em centavos. */
  price: number;
  description: string;
}

export interface LinkCriado {
  url: string;
  bruto: unknown;
}

/**
 * Cria o link de pagamento. `orderNsu` é o nosso protocolo: é por ele que a
 * notificação volta a encontrar a inscrição.
 */
export async function criarLinkDePagamento(opcoes: {
  handle: string;
  itens: ItemDaCobranca[];
  orderNsu: string;
  redirectUrl: string;
  webhookUrl: string;
  cliente?: { name?: string; email?: string; phone_number?: string };
}): Promise<LinkCriado> {
  const resposta = await fetch(`${BASE}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      handle: opcoes.handle,
      items: opcoes.itens,
      order_nsu: opcoes.orderNsu,
      redirect_url: opcoes.redirectUrl,
      webhook_url: opcoes.webhookUrl,
      ...(opcoes.cliente ? { customer: opcoes.cliente } : {}),
    }),
  });

  const texto = await resposta.text();
  if (!resposta.ok) {
    throw new Error(`InfinitePay respondeu ${resposta.status}: ${texto.slice(0, 300)}`);
  }

  let dados: { url?: string; link?: string; checkout_url?: string };
  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error(`InfinitePay devolveu algo que não é JSON: ${texto.slice(0, 200)}`);
  }

  // A documentação chama o campo de "url"; aceitamos os vizinhos por garantia,
  // porque um nome diferente aqui derrubaria o pagamento inteiro em silêncio.
  const url = dados.url ?? dados.link ?? dados.checkout_url;
  if (!url) {
    throw new Error(`InfinitePay não devolveu a URL do checkout: ${texto.slice(0, 200)}`);
  }

  return { url, bruto: dados };
}

export interface SituacaoDoPagamento {
  pago: boolean;
  /** Em centavos, o que foi efetivamente pago. */
  valorPago: number;
  parcelas: number;
  /** 'pix', 'credit_card' etc., como a InfinitePay informa. */
  formaDeCaptura: string;
}

/**
 * Confere na fonte se a cobrança foi mesmo paga.
 *
 * É esta chamada — e não o corpo do webhook — que autoriza marcar uma
 * inscrição como paga.
 */
export async function consultarPagamento(opcoes: {
  handle: string;
  transactionNsu: string;
  externalOrderNsu: string;
  /** Em centavos, o valor que esperamos ter sido pago. */
  valorEsperado: number;
}): Promise<SituacaoDoPagamento> {
  const resposta = await fetch(`${BASE}/payment_check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      handle: opcoes.handle,
      transaction_nsu: opcoes.transactionNsu,
      external_order_nsu: opcoes.externalOrderNsu,
      slug: opcoes.transactionNsu,
    }),
  });

  const texto = await resposta.text();
  if (!resposta.ok) {
    throw new Error(`payment_check respondeu ${resposta.status}: ${texto.slice(0, 300)}`);
  }

  let dados: {
    success?: boolean;
    paid?: boolean;
    amount?: number;
    paid_amount?: number;
    installments?: number;
    capture_method?: string;
  };
  try {
    dados = JSON.parse(texto);
  } catch {
    throw new Error(`payment_check devolveu algo que não é JSON: ${texto.slice(0, 200)}`);
  }

  const valorPago = Number(dados.paid_amount ?? 0);

  return {
    // Pago de verdade: a API diz que sim E o valor bate com o que cobramos.
    // Sem a segunda metade, uma cobrança de R$ 1 "aprovada" valeria uma vaga.
    pago: Boolean(dados.success) && Boolean(dados.paid) && valorPago >= opcoes.valorEsperado,
    valorPago,
    parcelas: Number(dados.installments ?? 1),
    formaDeCaptura: String(dados.capture_method ?? ''),
  };
}

/** Traduz a forma de captura para o que vai escrito na planilha. */
export function nomeDaForma(formaDeCaptura: string): string {
  const f = formaDeCaptura.toLowerCase();
  if (f.includes('pix')) return 'PIX';
  if (f.includes('credit')) return 'Cartão de crédito';
  if (f.includes('debit')) return 'Cartão de débito';
  return formaDeCaptura || 'Não informado';
}
