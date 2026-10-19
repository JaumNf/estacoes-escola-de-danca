import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Users } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AguardandoPagamento from './AguardandoPagamento';
import { CHECKOUT, COMUNIDADE_WHATSAPP, EDICAO, WHATSAPP_ESCOLA } from '@/lib/intensivo';
import { consultarPagamento } from '@/lib/pagamento';

/**
 * Para onde a InfinitePay devolve a pessoa depois do checkout.
 *
 * Voltar para cá não prova nada por si só — dá para fechar a tela antes de
 * pagar. Então a página pergunta à InfinitePay se aquela cobrança foi mesmo
 * paga, e só aí mostra o link do grupo.
 *
 * ⚠️  Isto é um portão, não uma fechadura. Convite de grupo do WhatsApp é um
 *     link público: quem receber esta URL de alguém que pagou enxerga o mesmo
 *     botão. O objetivo é evitar que quem abandonou o checkout entre no grupo,
 *     e para isso basta.
 */

export const metadata: Metadata = {
  title: `Inscrição recebida — ${EDICAO.nome} | Estações Escola de Dança`,
  description: 'Recebemos sua inscrição no curso intensivo.',
  robots: { index: false, follow: false },
};

/** A InfinitePay acrescenta os parâmetros dela; aceitamos os dois nomes. */
interface Parametros {
  protocolo?: string;
  order_nsu?: string;
  transaction_nsu?: string;
  slug?: string;
}

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<Parametros>;
}) {
  const params = await searchParams;
  const protocolo = params.protocolo ?? params.order_nsu;
  const transacao = params.transaction_nsu ?? params.slug;

  // Sem transação não há o que conferir: a pessoa chegou aqui por outro
  // caminho, ou abandonou o checkout antes de gerar a cobrança.
  let pago = false;
  if (transacao && CHECKOUT.ativo && CHECKOUT.handle) {
    try {
      const situacao = await consultarPagamento({
        handle: CHECKOUT.handle,
        transactionNsu: transacao,
        externalOrderNsu: protocolo ?? '',
      });
      pago = situacao.pago;
    } catch (falha) {
      // Indisponibilidade da InfinitePay não vira "pago", nem tela de erro:
      // a pessoa cai no estado de espera, que já oferece o WhatsApp.
      console.error('[obrigado] não consegui conferir o pagamento:', falha);
    }
  }

  const mensagemWhatsapp = encodeURIComponent(
    protocolo
      ? `Oi! Acabei de me inscrever no ${EDICAO.nome}. Meu protocolo é ${protocolo}.`
      : `Oi! Acabei de me inscrever no ${EDICAO.nome}.`,
  );

  return (
    <main className="min-h-screen bg-[#3d1c04] flex flex-col">
      <Header />

      <section className="flex-1 px-6 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-black/5 p-8 md:p-12 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              pago ? 'bg-green-100' : 'bg-brown-100'
            }`}
          >
            <CheckCircle2 className={pago ? 'text-green-600' : 'text-brown-500'} size={32} aria-hidden />
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-3">
            {pago ? 'Pagamento confirmado!' : 'Inscrição recebida!'}
          </h1>

          <p className="text-brown-700 text-lg mb-8">
            {pago
              ? 'Sua vaga está garantida. Entre no grupo para receber os avisos do curso — horário, local e tudo que mudar.'
              : 'Assim que o pagamento compensar, a gente confirma sua vaga pelo WhatsApp.'}
          </p>

          {protocolo && (
            <div className="inline-flex flex-col items-center gap-1 bg-brown-50 border border-brown-200 rounded-2xl px-8 py-5 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brown-600">
                Protocolo
              </span>
              <span className="text-2xl font-display font-bold text-[#682c0b] tabular-nums tracking-wide">
                {protocolo}
              </span>
            </div>
          )}

          {/* Enquanto não há confirmação, a página se atualiza sozinha. */}
          {!pago && transacao && (
            <div className="mb-8">
              <AguardandoPagamento protocolo={protocolo} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {pago ? (
              <a
                href={COMUNIDADE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#1da851]"
              >
                <Users size={18} aria-hidden /> Entrar no grupo
              </a>
            ) : (
              <a
                href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagemWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold hover:bg-terracotta"
              >
                <MessageCircle size={18} aria-hidden /> Falar no WhatsApp
              </a>
            )}

            <Link
              href="/cursos-intensivos"
              className="pressable inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-brown-800 border-2 border-brown-200 hover:bg-brown-50"
            >
              Voltar ao curso
            </Link>
          </div>

          {pago && (
            <p className="text-sm text-brown-600 mt-6">
              Guarde o protocolo. Qualquer coisa,{' '}
              <a
                href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagemWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-orange-700 underline underline-offset-2"
              >
                fala com a gente
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
