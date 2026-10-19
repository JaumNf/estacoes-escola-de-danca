'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageCircle } from 'lucide-react';

import { EDICAO, WHATSAPP_ESCOLA } from '@/lib/intensivo';

/**
 * Mostrado quando a pessoa voltou do checkout mas a InfinitePay ainda não
 * confirma o pagamento.
 *
 * O PIX costuma compensar em segundos, mas "costuma" não é promessa: em vez de
 * deixar a pessoa olhando para uma tela parada, a página se atualiza sozinha
 * por cerca de um minuto. Passado isso, para de tentar e oferece o caminho
 * humano — insistir para sempre só gastaria bateria e esperança.
 */

const INTERVALO_MS = 5000;
const MAXIMO_DE_TENTATIVAS = 12; // ~1 minuto

export default function AguardandoPagamento({ protocolo }: { protocolo?: string }) {
  const router = useRouter();
  const [tentativas, setTentativas] = useState(0);
  const desistiu = tentativas >= MAXIMO_DE_TENTATIVAS;

  useEffect(() => {
    if (desistiu) return;
    const id = window.setTimeout(() => {
      setTentativas((n) => n + 1);
      // Refaz a renderização no servidor, que reconsulta a InfinitePay.
      router.refresh();
    }, INTERVALO_MS);
    return () => window.clearTimeout(id);
  }, [tentativas, desistiu, router]);

  const mensagem = encodeURIComponent(
    protocolo
      ? `Oi! Paguei a inscrição do ${EDICAO.nome} e quero confirmar. Meu protocolo é ${protocolo}.`
      : `Oi! Paguei a inscrição do ${EDICAO.nome} e quero confirmar.`,
  );

  if (desistiu) {
    return (
      <div className="rounded-2xl border border-brown-200 bg-brown-50 px-5 py-5">
        <p className="text-brown-800 font-medium mb-1">
          Ainda não vimos seu pagamento chegar.
        </p>
        <p className="text-sm text-brown-700 mb-4">
          Se você já pagou, não se preocupe: a confirmação pode demorar um pouco mais. Chama a
          gente no WhatsApp com o seu protocolo que a gente resolve na hora.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagem}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-5 py-3 rounded-xl font-bold hover:bg-terracotta"
        >
          <MessageCircle size={17} aria-hidden /> Falar no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="rounded-2xl border border-brown-200 bg-brown-50 px-5 py-5 flex items-center gap-3"
    >
      <Loader2 size={20} className="animate-spin text-orange-600 shrink-0" aria-hidden />
      <p className="text-sm text-brown-700 text-left">
        Estamos confirmando seu pagamento. Pode deixar esta página aberta — ela se atualiza
        sozinha.
      </p>
    </div>
  );
}
