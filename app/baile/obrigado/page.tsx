import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, MessageCircle, Users } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AguardandoPagamento from '@/components/AguardandoPagamento';
import { BAILE } from '@/lib/baile';
import { CHECKOUT, COMUNIDADE_WHATSAPP, WHATSAPP_ESCOLA } from '@/lib/intensivo';
import { consultarPagamento } from '@/lib/pagamento';

/**
 * Para onde a InfinitePay devolve quem compra o ingresso do baile.
 *
 * Voltar para cá não prova nada por si só — dá para fechar a tela antes de
 * pagar. Então a página pergunta à InfinitePay se aquela cobrança foi mesmo
 * paga, e só aí diz que o ingresso está garantido.
 *
 * É gêmea de `/cursos-intensivos/inscricao/obrigado` e usa a mesma
 * `consultarPagamento` — a lógica de conferência existe num lugar só, que é o
 * que importa, porque foi exatamente ali que dois nomes de campo errados
 * fizeram todo pagamento voltar como "não pago" até 18/10/2026.
 */

export const metadata: Metadata = {
  title: `Ingresso recebido — ${BAILE.nome} | Estações Escola de Dança`,
  description: 'Recebemos sua compra do ingresso do baile.',
  robots: { index: false, follow: false },
};

/** A InfinitePay acrescenta os parâmetros dela; aceitamos os dois nomes. */
interface Parametros {
  protocolo?: string;
  order_nsu?: string;
  transaction_nsu?: string;
  slug?: string;
}

export default async function ObrigadoDoBailePage({
  searchParams,
}: {
  searchParams: Promise<Parametros>;
}) {
  const params = await searchParams;
  const protocolo = params.protocolo ?? params.order_nsu;

  // `transaction_nsu` e `slug` são valores DIFERENTES: o primeiro identifica a
  // transação, o segundo a fatura. `payment_check` quer os dois, cada um no seu
  // campo — tratá-los como sinônimos é o que fazia toda consulta voltar
  // "não pago".
  const transacao = params.transaction_nsu ?? '';
  const slug = params.slug ?? '';
  const temIdentificador = Boolean(transacao || slug);

  let pago = false;
  if (temIdentificador && CHECKOUT.ativo && CHECKOUT.handle) {
    try {
      const situacao = await consultarPagamento({
        handle: CHECKOUT.handle,
        transactionNsu: transacao,
        orderNsu: protocolo ?? '',
        slug,
      });
      pago = situacao.pago;
    } catch (falha) {
      // Indisponibilidade da InfinitePay não vira "pago", nem tela de erro: a
      // pessoa cai no estado de espera, que já oferece o WhatsApp.
      console.error('[baile/obrigado] não consegui conferir o pagamento:', falha);
    }
  }

  const oQue = `o ingresso do ${BAILE.nome}`;
  const mensagemWhatsapp = encodeURIComponent(
    protocolo
      ? `Oi! Acabei de comprar ${oQue}. Meu protocolo é ${protocolo}.`
      : `Oi! Acabei de comprar ${oQue}.`,
  );

  return (
    <main className="min-h-screen bg-[#311707] flex flex-col">
      <Header />

      <section className="flex-1 px-6 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-black/5 p-8 md:p-12 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              pago ? 'bg-green-100' : 'bg-brown-100'
            }`}
          >
            <CheckCircle2
              className={pago ? 'text-green-600' : 'text-brown-500'}
              size={32}
              aria-hidden
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-3">
            {pago ? 'Ingresso garantido!' : 'Compra recebida!'}
          </h1>

          <p className="text-brown-700 text-lg mb-8">
            {pago
              ? 'Te esperamos na pista. Não precisa imprimir nada — é só chegar e dizer seu nome na entrada.'
              : 'Assim que o pagamento compensar, a gente confirma seu ingresso pelo WhatsApp.'}
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
          {!pago && temIdentificador && (
            <div className="mb-8">
              <AguardandoPagamento protocolo={protocolo} oQue={oQue} />
            </div>
          )}

          {/* Onde e quando, para quem vai fechar a aba e só voltar no sábado. */}
          {pago && (
            <div className="text-left bg-brown-50 border border-brown-200 rounded-2xl px-5 py-4 mb-8 space-y-2">
              <p className="flex items-start gap-2 text-sm text-brown-800">
                <Clock size={16} className="text-orange-600 shrink-0 mt-0.5" aria-hidden />
                <span>
                  <strong>{BAILE.periodo}</strong>, {BAILE.horario}
                </span>
              </p>
              <p className="flex items-start gap-2 text-sm text-brown-800">
                <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" aria-hidden />
                <span>
                  {BAILE.local}
                  <span className="block text-brown-600">{BAILE.cidade}</span>
                </span>
              </p>
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
              href="/baile"
              className="pressable inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-brown-800 border-2 border-brown-200 hover:bg-brown-50"
            >
              Voltar ao baile
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
