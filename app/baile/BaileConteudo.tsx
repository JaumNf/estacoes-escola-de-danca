'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
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

/** Quanto tempo antes do baile a venda fecha, escrito para gente ler. */
function prazoEscrito(): string {
  const minutos = BAILE.fechaAntesEmMinutos;
  if (minutos % 60 === 0) {
    const horas = minutos / 60;
    return horas === 1 ? '1 hora' : `${horas} horas`;
  }
  return `${minutos} minutos`;
}

export default function BaileConteudo() {
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

        <div className="max-w-7xl mx-auto text-center relative z-30 px-6 mt-16">
          {ativo && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
            >
              <Calendar size={13} aria-hidden /> {BAILE.periodo}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.7, duration: 1.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-white"
          >
            {ativo ? BAILE.nome : 'Nossos Bailes'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-orange-50 max-w-2xl mx-auto mb-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-medium"
          >
            {ativo
              ? BAILE.chamada
              : 'A prática faz o dançarino. Venha se divertir, conhecer gente nova e colocar em prática tudo o que você aprendeu em aula.'}
          </motion.p>

          <motion.a
            href="#ingressos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pressable bg-rose-600 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-rose-800 shadow-lg inline-flex items-center gap-2 relative z-50"
          >
            {ativo ? `Garantir meu ingresso — ${formatarReais(BAILE.antecipado)}` : 'Quero ser avisado'}{' '}
            <Ticket size={20} aria-hidden />
          </motion.a>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <WaveDivider position="bottom" colorClass="fill-orange-50" />
        </div>
      </section>

      {/* ── O ambiente ────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
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
      </motion.section>

      {/* ── A próxima edição ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
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
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-rose-500" size={20} aria-hidden />
                <h3 className="font-bold text-[#682c0b] tracking-wide uppercase text-sm">
                  Teatro do Mundo
                </h3>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#fffcf5] rounded-xl p-3 text-center min-w-[70px] border border-orange-100">
                  {ativo ? (
                    <>
                      <span className="block text-xl font-bold text-[#682c0b] tabular-nums">
                        {BAILE.dia}
                      </span>
                      <span className="block text-xs font-bold text-orange-500 uppercase">
                        {BAILE.mes}
                      </span>
                    </>
                  ) : (
                    <Calendar className="text-orange-400 mx-auto" size={24} aria-hidden />
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-display font-bold text-[#682c0b] mb-1">
                    {ativo ? BAILE.nome : 'Próximo baile em breve!'}
                  </h4>
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
                      <p className="flex items-center gap-2 text-xs text-orange-600 tabular-nums">
                        <Clock size={14} aria-hidden /> {BAILE.horario}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-orange-600">
                        <MapPin size={14} aria-hidden /> {BAILE.local}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Ingressos ─────────────────────────────────────────────────────── */}
      <motion.section
        id="ingressos"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
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
              <div>
                <span className="text-rose-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                  {ativo ? 'Venda antecipada' : 'Fique por dentro'}
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-50 mb-4">
                  {ativo ? 'Garanta seu ingresso' : 'Novas edições em breve'}
                </h2>
                <p className="text-orange-200 text-lg leading-relaxed">
                  {ativo
                    ? `Comprando aqui sai ${formatarReais(
                        BAILE.antecipado,
                      )}. Na portaria, ${formatarReais(BAILE.naHora)}.`
                    : 'Nossos bailes acontecem em edições especiais ao longo do ano. A venda de ingressos abre quando a próxima data é anunciada.'}
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
      </motion.section>

      <Footer />
    </main>
  );
}
