'use client';

import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import { MapPin, Clock, Sparkles, Heart, Music, Star } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import InscricaoForm from './InscricaoForm';
import Countdown from './Countdown';
import BotaoInscricao from './BotaoInscricao';
import NiveisSection from './NiveisSection';
import FaqIntensivo from './FaqIntensivo';
import Footer from '@/components/Footer';
import EdicaoEmBreve from '@/components/EdicaoEmBreve';
import { EDICAO, aulasPorDia } from '@/lib/intensivo';

// O título, as datas, as aulas, os preços e a chave PIX vivem todos em
// lib/intensivo.ts — inclusive este interruptor. Nada de data ou preço
// escrito à mão nesta página.
const EDICAO_ATIVA = EDICAO.ativa;

/**
 * A ordem da página é a ordem da decisão: o que é, quando acontece, para quem
 * é, inscrição, onde é, e as dúvidas que sobram. O formulário fica no meio, e
 * não no fim, porque quem já decidiu não deveria ter que atravessar o resto.
 * Depois dele, endereço e FAQ existem para derrubar a objeção de quem ainda
 * não decidiu — e cada um termina com um caminho de volta para a inscrição.
 */
export default function CursosIntensivos() {
  return (
    <main className="min-h-screen bg-orange-50 relative">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#120400] text-orange-50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cursos-intensivos-curso-de-inverno-estacoes.webp"
            alt="Turma do curso intensivo da Estações dançando em roda"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120400] via-black/40 to-transparent pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto text-center relative z-10 px-6 py-16 flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight mt-8">
            {EDICAO_ATIVA ? EDICAO.nome : 'Cursos Intensivos'}
          </h1>

          <p className="text-xl md:text-2xl text-[#fcd34d] font-bold max-w-2xl mx-auto mb-10">
            {EDICAO_ATIVA
              ? `${EDICAO.periodo}. ${EDICAO.chamada}`
              : 'Novas edições em breve. Fins de semana intensivos para aprender um ritmo do zero.'}
          </p>

          {EDICAO_ATIVA && <Countdown />}

          <div className="mt-4 w-full flex justify-center">
            {EDICAO_ATIVA ? (
              <BotaoInscricao variante="ouro" />
            ) : (
              <BotaoInscricao variante="ouro" legenda={null}>
                Quero ser avisado
              </BotaoInscricao>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20">
          <WaveDivider position="bottom" colorClass="fill-orange-50" />
        </div>
      </section>

      {/* ── O que é ──────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="relative py-16 px-6 bg-orange-50"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="space-y-6 text-left order-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#682c0b] leading-tight mb-4 shrink-0">
              Mais do que passos:<br /> confiança e movimento<br /> para todos.
            </h2>

            <p className="text-[#645c58] text-lg md:text-xl leading-relaxed font-medium shrink-0">
              Acreditamos que a dança não deve ser difícil; o passo mais desafiador é simplesmente vir praticar.
            </p>

            <p className="text-[#645c58] text-lg md:text-xl leading-relaxed font-medium shrink-0">
              Nosso ambiente é pensado para que ninguém fique de fora: acolhemos quem nunca dançou com segurança e desafiamos quem já dança a evoluir.
            </p>

            <blockquote className="bg-[#fcf8f2] border-l-[4px] border-orange-600 p-4 text-orange-700 font-medium italic text-lg md:text-xl rounded-r-lg shadow-sm my-4 shrink-0">
              &quot;Priorizamos o movimento sobre a teoria e a diversão sobre a rigidez.&quot;
            </blockquote>

            <p className="text-[#645c58] text-base leading-relaxed font-medium">
              Queremos que cada aluno saia daqui se sentindo capaz, leve e parte de uma comunidade vibrante. Para nós, quando a experiência é prazerosa e o ambiente é acolhedor, aprender acontece naturalmente.
            </p>
          </div>

          <div className="relative h-[300px] md:h-[600px] w-full mb-8 md:mb-0 block order-2">
            <div className="absolute top-4 -right-4 md:top-8 md:-right-8 w-full h-[80%] bg-[#e8a32a] rounded-[40px] md:rounded-[60px]" />
            <div className="relative h-[80%] w-full rounded-[40px] md:rounded-[60px] overflow-hidden border-4 border-orange-50 bg-gray-200">
              <Image
                src="/images/cursos-intensivos-turma-estacoes.webp"
                alt="Alunos da Estações em aula do curso intensivo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── O que é: o que você leva daqui ───────────────────────────────── */}
      <section className="relative py-16 w-full bg-orange-600">
        <svg viewBox="0 0 1440 100" className="absolute top-0 left-0 w-full h-[4vh] md:h-[4vh] -translate-y-[99%] text-orange-600 fill-current preserve-3d" preserveAspectRatio="none">
          <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" />
        </svg>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 shrink-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 uppercase tracking-wide">
              Festa, Arte e Liberdade
            </h2>
            <p className="text-lg md:text-xl text-orange-100 font-medium max-w-2xl mx-auto">
              Mergulhe na folia criativa e no aprendizado divertido.
            </p>
            <p className="text-orange-200 text-xs mt-3 font-bold uppercase tracking-widest">
              Arraste para os lados para ver mais
            </p>
          </div>

          <FestaCarousel />

          {EDICAO_ATIVA && <BotaoInscricao variante="ouro" className="mt-12" />}
        </div>

        <svg viewBox="0 0 1440 100" className="absolute bottom-0 left-0 w-full h-[4vh] md:h-[4vh] translate-y-[99%] text-orange-600 fill-current preserve-3d" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,50 Q1080,0 720,50 T0,50 Z" />
        </svg>
      </section>

      {/* ── Cronograma ───────────────────────────────────────────────────── */}
      {EDICAO_ATIVA && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative py-16 px-6 bg-orange-50/50"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center shrink-0">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#682c0b] mb-4">
                Cronograma
              </h2>
              <p className="text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
                <Sparkles className="text-[#e8a32a] fill-[#e8a32a] shrink-0" size={24} aria-hidden />
                {EDICAO.periodo}, no Teatro do Mundo.
                <Sparkles className="text-[#e8a32a] fill-[#e8a32a] shrink-0" size={24} aria-hidden />
              </p>
            </div>

            <div className="max-w-4xl mx-auto mt-8 md:mt-12 space-y-6 md:space-y-8 relative z-10">
              {aulasPorDia().map((dia) => (
                <div key={`${dia.dia}-${dia.mes}`} className="bg-orange-50/80 rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-sm border border-orange-100">
                  <div className="flex items-center gap-4 mb-5 border-b border-orange-200/50 pb-4">
                    <div className="bg-[#682c0b] text-white px-4 py-2 rounded-xl text-center shrink-0 shadow-sm">
                      <span className="block text-2xl font-display font-bold leading-none tabular-nums">{dia.dia}</span>
                      <span className="block text-[10px] uppercase tracking-wider font-bold mt-1 text-orange-200">{dia.mes}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-[#682c0b]">{dia.diaSemana}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {dia.aulas.map((aula) =>
                      aula.intervalo ? (
                        <div key={aula.id} className="flex items-center gap-2 px-1 sm:col-span-2 text-[#8a6a4a]">
                          <Clock size={13} className="shrink-0" aria-hidden />
                          <span className="text-xs font-bold tabular-nums">{aula.horario}</span>
                          <span className="text-xs">· {aula.nome}</span>
                        </div>
                      ) : aula.evento ? (
                        <div key={aula.id} className="flex flex-col text-left bg-orange-600/10 rounded-xl p-4 shadow-sm border border-orange-200 relative overflow-hidden sm:col-span-2">
                          <div className="absolute top-2 right-2 bg-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-widest flex items-center gap-1 z-10">
                            <Music size={10} className="fill-white" aria-hidden />
                            Aberto ao Público
                          </div>
                          <div className="relative z-10 mt-4 sm:mt-0">
                            <div className="flex items-center gap-1.5 text-orange-800 text-xs font-bold mb-1">
                              <Clock size={14} aria-hidden />
                              <span className="tabular-nums">{aula.horario}</span>
                            </div>
                            <h4 className="text-base font-bold text-[#682c0b] mb-1">{aula.nome}</h4>
                            {aula.descricao && (
                              <p className="text-xs text-orange-800 font-medium leading-snug">{aula.descricao}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div key={aula.id} className="flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                          <div className="flex justify-between items-start mb-2 w-full gap-2">
                            <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold">
                              <Clock size={14} aria-hidden />
                              <span className="tabular-nums">{aula.horario}</span>
                            </div>
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider shrink-0 ${aula.nivel === 'Do Zero' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {aula.nivel}
                            </span>
                          </div>
                          <h4 className="text-base md:text-lg font-bold text-[#682c0b]">{aula.nome}</h4>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            <BotaoInscricao className="mt-12" />
          </div>
        </motion.section>
      )}

      {/* ── Nível das aulas ──────────────────────────────────────────────── */}
      {EDICAO_ATIVA && <NiveisSection />}

      {/* ── Formulário ───────────────────────────────────────────────────── */}
      <section
        id="matricula"
        tabIndex={-1}
        className="relative py-20 px-6 bg-[#3d1c04] outline-none"
      >
        <WaveDivider position="top" colorClass="fill-orange-50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="w-full bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm">
            {EDICAO_ATIVA ? (
              <InscricaoForm />
            ) : (
              <EdicaoEmBreve
                titulo="Novas edições em breve!"
                descricao="As inscrições do próximo curso intensivo ainda não abriram. Entre na nossa comunidade no WhatsApp e seja a primeira pessoa a saber quando as vagas forem liberadas."
              />
            )}
          </div>
        </div>

        <WaveDivider position="bottom" colorClass="fill-orange-50" />
      </section>

      {/* ── Endereço ─────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="relative py-16 px-6 bg-orange-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4">
              Onde acontece
            </h2>
            <p className="text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto">
              Teatro do Mundo, no Centro de Campo Grande. Fácil de chegar.
            </p>
          </div>

          <div className="mt-10 bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="flex items-center gap-4 p-6 md:p-8 pb-5">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="text-white w-6 h-6" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-display font-bold text-[#682c0b]">
                  Rua Barão de Melgaço, 177
                </h3>
                <p className="text-sm text-[#645c58] font-medium">Centro · Campo Grande, MS</p>
              </div>
            </div>

            <div className="h-[260px] md:h-[340px] relative border-y border-orange-100">
              <iframe
                title="Mapa do Teatro do Mundo, na Rua Barão de Melgaço, 177"
                src="https://maps.google.com/maps?q=Rua%20Bar%C3%A3o%20de%20Melga%C3%A7o%2C%20177%2C%20Campo%20Grande%20-%20MS&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>

            <div className="p-6 md:p-8 pt-5">
              <a
                href="https://maps.google.com/?q=Rua+Barao+de+Melgaco,+177,+Campo+Grande+-+MS"
                target="_blank"
                rel="noopener noreferrer"
                className="pressable w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-[#c45424] flex justify-center items-center gap-2 text-sm uppercase tracking-wider"
              >
                <MapPin size={18} aria-hidden /> Traçar rota
              </a>
            </div>
          </div>

          {EDICAO_ATIVA && <BotaoInscricao className="mt-12" />}
        </div>
      </motion.section>

      {/* ── Dúvidas ──────────────────────────────────────────────────────── */}
      <FaqIntensivo />

      <Footer />
    </main>
  );
}

function FestaCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 10000, stopOnInteraction: false })],
  );

  const cards = [
    {
      titleTop: 'Conforto e',
      titleBottom: 'Confiança.',
      icon: <Heart className="text-orange-600 w-8 h-8 fill-current shrink-0 ml-2" aria-hidden />,
      desc: 'Você aprende desde a base. Com menos vergonha e mais segurança pra se soltar e curtir.',
    },
    {
      titleTop: 'Leve e',
      titleBottom: 'Divertido.',
      icon: <Music className="text-orange-600 w-8 h-8 fill-current shrink-0 ml-2" aria-hidden />,
      desc: 'Aulas dinâmicas que respeitam seu ritmo e trazem a alegria da arte para o seu dia.',
    },
    {
      titleTop: 'Vontade de',
      titleBottom: 'Continuar.',
      icon: <Star className="text-orange-600 w-8 h-8 fill-current shrink-0 ml-2" aria-hidden />,
      desc: 'O sentimento de conquista ao final de cada aula vai te motivar a ir além.',
    },
  ];

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full mt-12 relative z-10 pb-4" ref={emblaRef}>
      <div className="flex">
        {cards.map((card) => (
          <div className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_33.333333%] min-w-0 pr-6" key={card.titleBottom}>
            <div className="bg-[#fff7d6] border-4 border-[#ffb100] rounded-[32px] p-8 shadow-xl hover-fine:-translate-y-2 transition-transform h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#8a2f07] leading-tight">
                  {card.titleTop}<br />{card.titleBottom}
                </h3>
                {card.icon}
              </div>
              <p className="text-[#8a2f07]/80 text-lg md:text-xl font-medium leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
