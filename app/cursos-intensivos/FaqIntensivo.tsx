'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import {
  BAILE,
  CREDITO,
  DESCONTOS,
  EDICAO,
  TOTAL_DE_AULAS,
  formatarReais,
  loteAtivo,
} from '@/lib/intensivo';
import BotaoInscricao from './BotaoInscricao';

/**
 * As perguntas do intensivo — não as da escola (essas ficam em
 * components/FAQSection.tsx, que fala de mensalidade e unidades).
 *
 * Os valores saem da configuração, então uma troca de lote não deixa resposta
 * velha no ar.
 */
function perguntas() {
  const lote = loteAtivo();
  const faixaCheia = DESCONTOS.find((d) => d.incluiBaile);

  return [
    {
      pergunta: 'Nunca dancei. As aulas são para mim?',
      resposta: `São. As ${TOTAL_DE_AULAS} aulas desta edição começam do zero: ninguém precisa saber nada antes de entrar. A gente explica passo a passo e no seu tempo.`,
    },
    {
      pergunta: 'Preciso levar par?',
      resposta:
        'Não. Durante a aula a gente faz rodízio, então você dança a aula inteira mesmo vindo sozinho(a).',
    },
    {
      pergunta: 'Posso fazer só uma aula?',
      resposta: `Pode. Cada aula custa ${formatarReais(lote.porAula)} (${formatarReais(lote.porAulaDupla)} a dupla) e você escolhe as que couberem na sua semana. ${
        faixaCheia
          ? `Fazendo as ${TOTAL_DE_AULAS}, saem ${faixaCheia.percentual}% de desconto e a entrada do baile vai junto.`
          : ''
      }`,
    },
    {
      pergunta: 'O baile é só para quem faz as aulas?',
      resposta: `Não, o baile é aberto ao público. A entrada custa ${formatarReais(
        BAILE.antecipado,
      )} comprando aqui pelo site (${formatarReais(
        BAILE.antecipadoDupla,
      )} a dupla) e ${formatarReais(
        BAILE.naHora,
      )} na portaria. A venda antecipada fecha uma hora antes de começar.`,
    },
    {
      pergunta: 'Como pago?',
      resposta: CREDITO.ativo
        ? `Por PIX ou no cartão de crédito. No PIX, o QR Code já aparece com o valor certo e você anexa o comprovante no próprio formulário. No crédito, o pagamento abre na página da ${CREDITO.operadora}.`
        : 'Por PIX. O QR Code aparece com o valor já preenchido e você anexa o comprovante no próprio formulário — a gente confere e confirma sua vaga pelo WhatsApp.',
    },
    {
      pergunta: 'Que roupa eu uso?',
      resposta:
        'Roupa confortável, que não limite o movimento, e sapato fechado. O importante é você se sentir à vontade para se mexer.',
    },
    {
      pergunta: 'Onde é?',
      resposta: `${EDICAO.local}, em ${EDICAO.cidade}. ${EDICAO.periodo}.`,
    },
  ];
}

export default function FaqIntensivo() {
  const [aberta, setAberta] = useState<number | null>(0);
  const itens = perguntas();

  return (
    <motion.section
      id="faq-intensivo"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative py-16 px-6 bg-orange-50"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4 text-center">
          Ainda em dúvida?
        </h2>
        <p className="text-lg text-[#645c58] font-medium text-center mb-10">
          O que mais perguntam antes de se inscrever.
        </p>

        <div className="space-y-3">
          {itens.map((item, i) => {
            const estaAberta = aberta === i;
            return (
              <div
                key={item.pergunta}
                className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setAberta(estaAberta ? null : i)}
                    aria-expanded={estaAberta}
                    aria-controls={`faq-resposta-${i}`}
                    className="pressable-lg w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-orange-50/60"
                  >
                    <span className="font-bold text-[#682c0b]">{item.pergunta}</span>
                    <ChevronDown
                      size={20}
                      aria-hidden
                      className={`shrink-0 text-orange-600 transition-transform duration-200 ${
                        estaAberta ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {estaAberta && (
                    <motion.div
                      id={`faq-resposta-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[#645c58] leading-relaxed">{item.resposta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <BotaoInscricao className="mt-12" legenda="Vagas limitadas — a turma fecha quando lotar." />
      </div>
    </motion.section>
  );
}
