'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import WaveDivider from '@/components/WaveDivider';

const faqs = [
  {
    question: 'Nunca dancei na vida, as aulas são para mim?',
    answer: 'Sim! Nossa escola é focada em acolher quem está começando do zero. Explicamos cada passo de forma paciente e estruturada, garantindo que você se sinta seguro(a) para aprender no seu próprio ritmo.',
  },
  {
    question: 'Preciso ter par para fazer as aulas?',
    answer: 'Não é necessário! O ambiente foi pensado para que todos dancem. Em nossas aulas, realizamos trocas frequentes de pares para que os alunos se conheçam e pratiquem a dinâmica da dança de salão com diferentes pessoas.',
  },
  {
    question: 'Qual roupa devo usar nas aulas?',
    answer: 'Recomendamos o uso de roupas confortáveis que permitam a movimentação livre e sapatos fechados (tênis ou sapatos de dança) que não limitem seus passos. O mais importante é você se sentir à vontade.',
  },
  {
    question: 'Como funciona o pagamento das mensalidades?',
    answer: 'Nossas mensalidades já incluem o valor da matrícula. O pagamento pode ser feito via PIX, transferência ou cartão de crédito, sendo renovado mensalmente ou através de planos mais longos (trimestrais, semestrais) com condições especiais.',
  },
  {
    question: 'Quais os dias e horários das aulas nas unidades?',
    answer: 'No momento, estamos localizados em duas unidades em Campo Grande - MS (Centro e Oeste). Confira a página "Aulas Regulares" para detalhes completos sobre nossa grade de horários, estilos musicais (Vanera, Forró, Salsa, etc.) e qual turma atende melhor à sua rotina.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section 
      id="faq" 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-brown-100"
    >
      <WaveDivider position="top" colorClass="fill-brown-50" />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brown-900 mb-4">Perguntas Frequentes</h2>
          <div className="w-16 h-1 bg-terracotta mx-auto rounded-full mb-4"></div>
          <p className="text-brown-700 max-w-2xl mx-auto text-base md:text-lg">Tire suas dúvidas antes de começar a dançar com a gente.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index} 
                className="bg-white rounded-[24px] shadow-sm border border-brown-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-brown-50 transition-colors"
                >
                  <span className="font-bold text-brown-900 text-lg pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-terracotta"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 text-brown-800 leading-relaxed border-t border-brown-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
