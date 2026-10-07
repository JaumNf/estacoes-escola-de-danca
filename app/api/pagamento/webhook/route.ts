import { NextRequest, NextResponse } from 'next/server';
import { CHECKOUT } from '@/lib/intensivo';
import { consultarPagamento, nomeDaForma } from '@/lib/pagamento';

/**
 * Recebe o aviso de pagamento aprovado da InfinitePay e marca a inscrição
 * como paga na planilha.
 *
 * ⚠️  O corpo deste POST não é prova de nada. A API da InfinitePay se
 *     identifica só pelo handle, sem chave secreta nem assinatura no webhook:
 *     qualquer um que descubra esta URL pode mandar um "pago" falso. Por isso
 *     o fluxo aqui é sempre:
 *
 *       1. ler o protocolo e o número da transação do corpo;
 *       2. perguntar à InfinitePay, por `payment_check`, se aquilo foi pago
 *          mesmo e por quanto;
 *       3. só então escrever na planilha.
 *
 *     O passo 2 é o que separa uma confirmação de um palpite.
 */

export async function POST(request: NextRequest) {
  if (!CHECKOUT.ativo || !CHECKOUT.handle) {
    return NextResponse.json({ erro: 'checkout desligado' }, { status: 503 });
  }

  const webhook = process.env.INSCRICOES_WEBHOOK_URL;
  const token = process.env.INSCRICOES_TOKEN;
  if (!webhook || !token) {
    console.error('[pagamento] planilha não configurada; o aviso foi perdido');
    return NextResponse.json({ erro: 'planilha não configurada' }, { status: 503 });
  }

  let aviso: {
    order_nsu?: string;
    transaction_nsu?: string;
    invoice_slug?: string;
    amount?: number;
    paid_amount?: number;
    installments?: number;
    capture_method?: string;
    receipt_url?: string;
  };
  try {
    aviso = await request.json();
  } catch {
    return NextResponse.json({ erro: 'corpo inválido' }, { status: 400 });
  }

  const protocolo = String(aviso.order_nsu ?? '').trim();
  const transacao = String(aviso.transaction_nsu ?? aviso.invoice_slug ?? '').trim();
  if (!protocolo || !transacao) {
    return NextResponse.json({ erro: 'aviso sem protocolo ou transação' }, { status: 400 });
  }

  // O valor que esperávamos é o que o próprio aviso diz ter sido cobrado; a
  // conferência abaixo recusa um pago_a_menos, que é o ataque óbvio.
  const valorEsperado = Number(aviso.amount ?? 0);

  let situacao;
  try {
    situacao = await consultarPagamento({
      handle: CHECKOUT.handle,
      transactionNsu: transacao,
      externalOrderNsu: protocolo,
      valorEsperado,
    });
  } catch (falha) {
    // Devolver 500 faz a InfinitePay tentar de novo mais tarde, que é o que
    // queremos: melhor repetir a conferência do que perder o pagamento.
    console.error('[pagamento] não consegui conferir na InfinitePay:', falha);
    return NextResponse.json({ erro: 'conferência indisponível' }, { status: 500 });
  }

  if (!situacao.pago) {
    console.warn(
      `[pagamento] aviso recusado para ${protocolo}: a InfinitePay não confirma o pagamento`,
    );
    return NextResponse.json({ erro: 'pagamento não confirmado na origem' }, { status: 409 });
  }

  try {
    const resposta = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
      redirect: 'follow',
      body: JSON.stringify({
        token,
        acao: 'confirmarPagamento',
        protocolo,
        transacao,
        valorPago: situacao.valorPago / 100,
        parcelas: situacao.parcelas,
        formaConfirmada: nomeDaForma(situacao.formaDeCaptura),
        reciboUrl: aviso.receipt_url ?? '',
      }),
    });

    const texto = await resposta.text();
    if (!resposta.ok) {
      console.error('[pagamento] planilha respondeu', resposta.status, texto.slice(0, 300));
      return NextResponse.json({ erro: 'planilha indisponível' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (falha) {
    console.error('[pagamento] falha ao marcar na planilha:', falha);
    return NextResponse.json({ erro: 'planilha indisponível' }, { status: 500 });
  }
}

/** Abrir a URL no navegador cai aqui — serve para conferir que está no ar. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    ativo: CHECKOUT.ativo && Boolean(CHECKOUT.handle),
    mensagem: 'Endpoint de confirmação de pagamento da Estações.',
  });
}
