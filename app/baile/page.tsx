import type { Metadata } from 'next';
import Image from 'next/image';
import { AlertCircle, Calendar, Clock, MapPin, Music, Ticket } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';
import EdicaoEmBreve from '@/components/EdicaoEmBreve';
import IngressoBaileForm from '@/components/IngressoBaileForm';
import { BAILE } from '@/lib/baile';
import { formatarReais } from '@/lib/comum';

/**
 * A página do baile.
 *
 * Aqui — e só aqui — se compra ingresso de baile. Até 20/10/2026 a entrada era
 * um item do formulário do curso intensivo, e esta página ficava desligada com
 * um formulário que mandava os dados para o `formsubmit.co`: não passava pelo
 * checkout, não confirmava pagamento e não chegava na planilha.
 *
 * Tudo que é da edição vem de `lib/baile.ts`. Não há data, hora nem preço
 * escrito neste arquivo.
 */


/**
 * `metadata` é o que faz o link aparecer com título, descrição e imagem
 * quando alguém manda a página no WhatsApp ou no Instagram — que é como a
 * maior parte do público chega. Até 20/10/2026 esta rota era um `'use client'`
 * só, e por isso não tinha metadata nenhuma: o link saía cru.
 *
 * Ela existe aqui, e não numa casca separada, porque nada nesta página precisa
 * rodar no navegador: o formulário de compra é o único client component, e ele
 * é importado como ilha.
 */

const TITULO = BAILE.ativo
  ? `${BAILE.nome} — ${BAILE.periodo} | Estações Escola de Dança`
  : 'Bailes | Estações Escola de Dança';

const DESCRICAO = BAILE.ativo
  ? `${BAILE.periodo}, ${BAILE.horario}, no Teatro do Mundo, em Campo Grande. Ingresso antecipado por ${formatarReais(
      BAILE.antecipado,
    )} — ${formatarReais(BAILE.naHora)} na portaria. Não precisa levar par.`
  : 'Nossos bailes acontecem em edições especiais ao longo do ano. Entre na comunidade e seja avisado da próxima data.';

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: '/baile' },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    url: '/baile',
    siteName: 'Estações Escola de Dança',
    locale: 'pt_BR',
    type: 'website',
  },
};

/** Quanto tempo antes do baile a venda fecha, escrito para gente ler. */
function prazoEscrito(): string {
  const minutos = BAILE.fechaAntesEmMinutos;
  if (minutos % 60 === 0) {
    const horas = minutos / 60;
    return horas === 1 ? '1 hora' : `${horas} horas`;
  }
  return `${minutos} minutos`;
}

export default function BailePage() {
  const ativo = BAILE.ativo;

  return (
    <main className="min-h-screen bg-[#fffcf5] flex flex-col relative before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] before:opacity-60 before:pointer-events-none before:z-[100]">
      <Header />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[100dvh] w-full bg-[#311707] text-orange-50 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/baile-baile-de-danca.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#311707]/90 via-black/50 to-transparent pointer-events-none" />

        {/* O único momento autoral da página, e feito em CSS de propósito:
            a entrada anterior era do `motion`, que mandava o herói inteiro com
            `opacity:0` no HTML do servidor — herói em branco quando o JS
            falhava, numa página que recebe dinheiro. */}
        <div className="max-w-7xl mx-auto text-center relative z-30 px-6 mt-16">
          {ativo && (
            <p className="surge inline-flex items-center gap-2 rounded-full bg-rose-700 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
              <Calendar size={13} aria-hidden /> {BAILE.periodo}
            </p>
          )}

          <h1
            className="surge text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-white text-balance"
            style={{ animationDelay: '60ms' }}
          >
            {ativo ? BAILE.nome : 'Nossos Bailes'}
          </h1>

          <p
            className="surge text-xl text-orange-50 max-w-2xl mx-auto mb-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-medium text-pretty"
            style={{ animationDelay: '140ms' }}
          >
            {ativo
              ? BAILE.chamada
              : 'A prática faz o dançarino. Venha se divertir, conhecer gente nova e colocar em prática tudo o que você aprendeu em aula.'}
          </p>

          <a
            href="#ingressos"
            className="surge pressable bg-rose-600 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-rose-800 shadow-lg shadow-black/30 inline-flex items-center gap-2 relative z-50"
            style={{ animationDelay: '220ms' }}
          >
            {ativo ? `Garantir meu ingresso — ${formatarReais(BAILE.antecipado)}` : 'Quero ser avisado'}{' '}
            <Ticket size={20} aria-hidden />
          </a>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <WaveDivider position="bottom" colorClass="fill-orange-50" />
        </div>
      </section>

      {/* ── O ambiente ────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-6">
            <Music size={32} aria-hidden />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b]">
            O Ambiente Perfeito
          </h2>
          <p className="text-lg text-[#644230] leading-relaxed max-w-3xl mx-auto">
            Nossos bailes são pensados para serem o ambiente mais acolhedor e divertido possível.
            Aqui, o objetivo não é a perfeição, mas a conexão. Com iluminação aconchegante, música
            de qualidade e uma comunidade vibrante, você vai descobrir que a dança de salão é muito
            mais do que passos: é sobre se sentir bem.
          </p>
          <p className="text-lg text-[#644230] leading-relaxed max-w-3xl mx-auto">
            <strong className="text-[#682c0b]">Não precisa levar par</strong> e não precisa saber
            dançar. O baile é aberto a todo mundo — aluno, ex-aluno e quem nunca pisou numa aula.
          </p>
        </div>
      </section>

      {/* ── A próxima edição ──────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 bg-[#fae8d4]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-4">
              {ativo ? 'A próxima edição' : 'Próximos Eventos'}
            </h2>
            <p className="text-[#874c2e]">
              {ativo ? 'Onde, quando e quanto.' : 'Confira a programação das nossas unidades.'}
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-[32px] p-8 shadow-lg shadow-orange-900/5 border border-orange-100 relative overflow-hidden hover-fine:-translate-y-1 transition-[translate,box-shadow] duration-240">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500" />
              {/* O local é um rótulo, não um título: quando era `h3` e o nome
                  do baile `h4`, a estrutura dizia que o Teatro do Mundo contém
                  o evento — o contrário do que a página conta, e o que um
                  leitor de tela anunciaria. */}
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-rose-600" size={20} aria-hidden />
                <p className="font-bold text-brown-800 tracking-wide uppercase text-sm">
                  Teatro do Mundo
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#fffcf5] rounded-xl p-3 text-center min-w-[70px] border border-orange-100">
                  {ativo ? (
                    <>
                      <span className="block text-xl font-bold text-[#682c0b] tabular-nums">
                        {BAILE.dia}
                      </span>
                      <span className="block text-xs font-bold text-brown-700 uppercase">
                        {BAILE.mes}
                      </span>
                    </>
                  ) : (
                    <Calendar className="text-orange-400 mx-auto" size={24} aria-hidden />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-[#682c0b] mb-1">
                    {ativo ? BAILE.nome : 'Próximo baile em breve!'}
                  </h3>
                  <p className="text-[#874c2e] text-sm mb-2">
                    {ativo ? (
                      BAILE.observacao
                    ) : (
                      <>
                        Estamos organizando a próxima edição.{' '}
                        <strong>
                          Assim que a data for definida, anunciamos aqui e na nossa comunidade no
                          WhatsApp.
                        </strong>
                      </>
                    )}
                  </p>
                  {ativo && (
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-xs text-brown-700 tabular-nums">
                        <Clock size={14} aria-hidden /> {BAILE.horario}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-brown-700">
                        <MapPin size={14} aria-hidden /> {BAILE.local}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ingressos ─────────────────────────────────────────────────────── */}
      <section
        id="ingressos"
        /* `overflow-clip`, e não `overflow-hidden`, por dois motivos medidos:
           1. os círculos decorativos abaixo passam 320px para fora da seção, e
              com `hidden` isso a torna um contêiner ROLÁVEL. O salto da âncora
              #ingressos então rolava a seção 128px para a esquerda no celular,
              cortando o formulário. `clip` não cria contêiner de rolagem.
           2. com `hidden`, a coluna `md:sticky` abaixo gruda num scrollport que
              não rola — ou seja, nunca gruda. Com `clip`, ela funciona. */
        className="py-24 px-6 bg-[#311707] text-orange-50 relative overflow-clip scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 md:sticky md:top-32">
              {/* Sem rótulo acima do título: "VENDA ANTECIPADA" sobre
                  "Garanta seu ingresso" dizia a mesma coisa duas vezes e
                  roubava peso do único título que precisa ser lido aqui. */}
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-50 mb-4 text-balance">
                  {ativo ? 'Garanta seu ingresso' : 'Novas edições em breve'}
                </h2>
                <p className="text-orange-100 text-lg leading-relaxed">
                  {ativo ? (
                    <>
                      Comprando aqui sai{' '}
                      <strong className="font-bold text-[#fbbf24] tabular-nums">
                        {formatarReais(BAILE.antecipado)}
                      </strong>
                      . Na portaria,{' '}
                      <span className="tabular-nums">{formatarReais(BAILE.naHora)}</span>.
                    </>
                  ) : (
                    'Nossos bailes acontecem em edições especiais ao longo do ano. A venda de ingressos abre quando a próxima data é anunciada.'
                  )}
                </p>
              </div>

              {ativo && (
                <div className="bg-orange-900/50 rounded-2xl p-6 border border-orange-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} aria-hidden />
                    <div className="space-y-2">
                      <p className="text-orange-200 text-sm font-medium">Antes de comprar:</p>
                      <ul className="text-orange-300 text-xs space-y-1.5 list-disc list-inside">
                        <li>
                          A venda pelo site fecha {prazoEscrito()} antes do baile. Depois disso, só
                          na portaria.
                        </li>
                        <li>
                          Na portaria:{' '}
                          <strong className="text-orange-200">
                            {formatarReais(BAILE.naHora)}
                          </strong>{' '}
                          por pessoa, dinheiro ou PIX.
                        </li>
                        <li>
                          Quem se inscreve nas aulas todas do curso intensivo{' '}
                          <strong className="text-orange-200">já entra sem pagar</strong> — não
                          precisa comprar ingresso aqui.
                        </li>
                        <li>No cartão, a operadora acrescenta a taxa dela.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {ativo ? (
              <IngressoBaileForm />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-[32px] shadow-2xl shadow-black/20">
                <EdicaoEmBreve
                  titulo="Ingressos ainda não disponíveis"
                  descricao="Assim que a data do próximo baile for confirmada, os ingressos ficam disponíveis aqui mesmo. Entre na comunidade do WhatsApp para não perder o anúncio."
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
