import type { Metadata } from 'next';
import { CheckCircle2, MessageCircle, Users } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AguardandoPagamento from '@/components/AguardandoPagamento';
import { CHECKOUT, EDICAO, GRUPO_INTENSIVO, WHATSAPP_ESCOLA } from '@/lib/intensivo';
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

  // A InfinitePay acrescenta `transaction_nsu` E `slug` ao redirect, e são
  // valores diferentes: o primeiro identifica a transação, o segundo a fatura.
  // `payment_check` quer os dois, cada um no seu campo — tratá-los como
  // sinônimos é o que fazia toda consulta voltar "não pago".
  const transacao = params.transaction_nsu ?? '';
  const slug = params.slug ?? '';
  const temIdentificador = Boolean(transacao || slug);

  // Sem identificador não há o que conferir: a pessoa chegou aqui por outro
  // caminho, ou abandonou o checkout antes de gerar a cobrança.
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
              ? 'Sua vaga está paga e garantida. Falta um passo: entrar no grupo do curso.'
              : 'Assim que o pagamento compensar, a gente confirma sua vaga pelo WhatsApp.'}
          </p>

          {/* Enquanto não há confirmação, a página se atualiza sozinha. */}
          {!pago && temIdentificador && (
            <div className="mb-8">
              <AguardandoPagamento protocolo={protocolo} oQue={`a inscrição do ${EDICAO.nome}`} />
            </div>
          )}

          {/* Uma ação só, e ela é o grupo.
              Quem chega aqui já pagou — não há nada a decidir, só uma coisa a
              fazer. Um segundo botão competindo ("Voltar ao curso") só dava a
              quem acabou de pagar uma porta para sair sem entrar no grupo, e é
              no grupo que a aula acontece: horário, local e qualquer mudança
              saem por lá e por mais nenhum canal. */}
          {pago ? (
            <>
              <a
                href={GRUPO_INTENSIVO}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-6 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-[#25D366]/25 hover:bg-[#1da851]"
              >
                <Users size={22} aria-hidden /> Entrar no grupo do curso
              </a>
              <p className="text-sm text-brown-700 mt-4">
                É por lá que a gente manda <strong className="text-[#682c0b]">horário, local
                e tudo que mudar</strong>. Quem não entra no grupo fica sem os avisos.
              </p>
            </>
          ) : (
            <a
              href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagemWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable w-full inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold hover:bg-terracotta"
            >
              <MessageCircle size={18} aria-hidden /> Falar no WhatsApp
            </a>
          )}

          {/* O protocolo fica, mas como referência — não como o assunto da
              tela. Quem precisa dele é quem vai falar com a escola, e o botão
              do WhatsApp acima já o leva embutido na mensagem. */}
          {protocolo && (
            <p className="text-xs text-brown-700 mt-8 pt-5 border-t border-brown-100">
              Protocolo{' '}
              <span className="font-bold tabular-nums tracking-wide">{protocolo}</span>
              {pago && (
                <>
                  {' '}·{' '}
                  <a
                    href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagemWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-orange-700 underline underline-offset-2"
                  >
                    falar com a gente
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
