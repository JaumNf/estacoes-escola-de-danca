'use client';

import { motion } from 'motion/react';
import { AULAS, TOTAL_DE_AULAS, ehVendavel, type Nivel } from '@/lib/intensivo';
import BotaoInscricao from './BotaoInscricao';

/**
 * Os níveis que esta edição realmente tem, na ordem em que aparecem no
 * cronograma. A seção se ajusta sozinha: se uma edição futura abrir uma turma
 * intermediária, ela entra aqui sem ninguém lembrar de editar este arquivo.
 */
function niveisDaEdicao(): Nivel[] {
  const vistos: Nivel[] = [];
  for (const aula of AULAS) {
    if (!ehVendavel(aula) || aula.evento) continue;
    if (!vistos.includes(aula.nivel)) vistos.push(aula.nivel);
  }
  return vistos;
}

/** As mesmas cores das etiquetas do cronograma — é o que torna isto uma legenda. */
const CORES: Record<Nivel, string> = {
  'Do Zero': 'bg-green-100 text-green-800 border-green-200',
  'Intermediário': 'bg-blue-100 text-blue-800 border-blue-200',
  'Todos os níveis': 'bg-orange-100 text-orange-800 border-orange-200',
};

const EXPLICACAO: Record<Nivel, string> = {
  'Do Zero':
    'Começa do primeiro passo. Ninguém precisa saber nada antes de entrar — e quem já dança aproveita para limpar a base.',
  'Intermediário':
    'Para quem já tem a base do ritmo e quer avançar em condução, variações e musicalidade.',
  'Todos os níveis':
    'Aberta para qualquer pessoa, dançando há anos ou há cinco minutos.',
};

export default function NiveisSection() {
  const niveis = niveisDaEdicao();
  const tudoDoZero = niveis.length === 1 && niveis[0] === 'Do Zero';

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative py-16 px-6 bg-orange-50"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4 text-center">
          Para que nível são as aulas?
        </h2>

        <p className="text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto text-center">
          {tudoDoZero
            ? `As ${TOTAL_DE_AULAS} aulas desta edição começam do zero. Se você nunca dançou, é exatamente aqui que se entra.`
            : 'Cada aula tem seu nível. A etiqueta no cronograma diz qual é.'}
        </p>

        <dl className="mt-10 space-y-6 max-w-2xl mx-auto">
          {niveis.map((nivel) => (
            <div key={nivel} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5">
              <dt className="shrink-0 sm:w-36">
                <span
                  className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded border uppercase tracking-wider ${CORES[nivel]}`}
                >
                  {nivel}
                </span>
              </dt>
              <dd className="text-[#645c58] text-base md:text-lg leading-relaxed">
                {EXPLICACAO[nivel]}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 max-w-2xl mx-auto border-t border-orange-200 pt-8 space-y-4">
          <p className="text-[#645c58] text-base md:text-lg leading-relaxed">
            <strong className="text-[#682c0b]">Não precisa levar par.</strong> A gente faz rodízio
            durante a aula, então dá para vir sozinho(a) e dançar a aula inteira.
          </p>
          <p className="text-[#645c58] text-base md:text-lg leading-relaxed">
            <strong className="text-[#682c0b]">Nem precisa fazer todas.</strong> Escolhe as aulas
            que cabem na sua semana — e se der para fazer as {TOTAL_DE_AULAS}, o desconto e a
            entrada do baile entram sozinhos.
          </p>
        </div>

        <BotaoInscricao className="mt-12" />
      </div>
    </motion.section>
  );
}
