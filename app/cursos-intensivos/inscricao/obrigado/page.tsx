import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EDICAO, WHATSAPP_ESCOLA } from '@/lib/intensivo';

/**
 * Para onde a InfinitePay devolve a pessoa depois do pagamento.
 *
 * Esta página não afirma que o pagamento foi aprovado: quem decide isso é o
 * webhook, conferindo na origem. Voltar para cá só significa que a pessoa
 * passou pelo checkout — ela pode ter fechado a tela antes de pagar, ou o PIX
 * pode ainda não ter compensado. Então a mensagem é de "recebemos", não de
 * "está pago", e a confirmação de verdade vai pelo WhatsApp.
 */

export const metadata: Metadata = {
  title: `Inscrição recebida — ${EDICAO.nome} | Estações Escola de Dança`,
  description: 'Recebemos sua inscrição no curso intensivo. Em instantes confirmamos pelo WhatsApp.',
  robots: { index: false, follow: false },
};

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ protocolo?: string }>;
}) {
  const { protocolo } = await searchParams;

  const mensagem = encodeURIComponent(
    protocolo
      ? `Oi! Acabei de me inscrever no ${EDICAO.nome}. Meu protocolo é ${protocolo}.`
      : `Oi! Acabei de me inscrever no ${EDICAO.nome}.`,
  );

  return (
    <main className="min-h-screen bg-[#3d1c04] flex flex-col">
      <Header />

      <section className="flex-1 px-6 pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-black/5 p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={32} aria-hidden />
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-3">
            Inscrição recebida!
          </h1>

          <p className="text-brown-700 text-lg mb-8">
            Assim que o pagamento compensar, a gente confirma sua vaga pelo WhatsApp. Se você
            fechou a tela antes de pagar, é só falar com a gente que mandamos o link de novo.
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagem}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold hover:bg-terracotta"
            >
              <MessageCircle size={18} aria-hidden /> Falar no WhatsApp
            </a>
            <Link
              href="/cursos-intensivos"
              className="pressable inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-brown-800 border-2 border-brown-200 hover:bg-brown-50"
            >
              Voltar ao curso
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
