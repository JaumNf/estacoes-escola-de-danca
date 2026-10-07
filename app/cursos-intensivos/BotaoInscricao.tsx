'use client';

import { ArrowRight } from 'lucide-react';
import { AULAS, calcularOrcamento, formatarReais, loteAtivo } from '@/lib/intensivo';

/** Tudo que dá para comprar: as aulas e o baile. */
const TUDO = AULAS.filter((aula) => !aula.intervalo).map((aula) => aula.id);

/**
 * Quanto custa fazer o intensivo inteiro — com o desconto das 4 aulas e o
 * baile de brinde já aplicados. É a frase mais forte que a página tem, e sai
 * do mesmo cálculo que o formulário usa: não há número escrito à mão.
 */
export function precoDoPacoteCompleto(): number {
  return calcularOrcamento(TUDO, 'individual').total;
}

export function precoPorAula(): number {
  return loteAtivo().porAula;
}

interface Props {
  /** Texto do botão. O padrão serve para a maioria dos lugares. */
  children?: React.ReactNode;
  /**
   * 'ouro' para fundo escuro ou laranja; 'escuro' para fundo claro.
   * Mesma forma e mesmas palavras nos dois: a página repete um afordance só,
   * não inventa um botão diferente por seção.
   */
  variante?: 'ouro' | 'escuro';
  /** Linha de apoio abaixo do botão. Passe null para esconder. */
  legenda?: React.ReactNode | null;
  className?: string;
}

export default function BotaoInscricao({
  children = 'Garantir minha vaga',
  variante = 'escuro',
  legenda,
  className = '',
}: Props) {
  const cores =
    variante === 'ouro'
      ? 'bg-[#fbbf24] text-[#682c0b] hover:bg-[#f59e0b] shadow-xl shadow-black/20'
      : 'bg-[#682c0b] text-orange-50 hover:bg-terracotta shadow-lg shadow-[#682c0b]/20';

  const corLegenda = variante === 'ouro' ? 'text-orange-100' : 'text-brown-700';

  function irParaOFormulario(evento: React.MouseEvent<HTMLAnchorElement>) {
    const alvo = document.getElementById('matricula');
    if (!alvo) return; // sem JS ou sem o alvo, o href resolve sozinho
    evento.preventDefault();

    const querMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    alvo.scrollIntoView({ behavior: querMenosMovimento ? 'auto' : 'smooth', block: 'start' });
    // Sem isto, quem navega por teclado continua no botão que ficou lá atrás.
    alvo.focus({ preventScroll: true });
  }

  return (
    <div className={`flex flex-col items-center gap-2.5 ${className}`}>
      <a
        href="#matricula"
        onClick={irParaOFormulario}
        className={`pressable inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold tracking-wide uppercase text-base md:text-lg group ${cores}`}
      >
        {children}
        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-120" />
      </a>

      {legenda !== null && (
        <p className={`text-sm font-medium ${corLegenda}`}>
          {legenda ?? (
            <>
              A partir de{' '}
              <strong className="font-bold">{formatarReais(precoPorAula())} por aula</strong> ·
              tudo por {formatarReais(precoDoPacoteCompleto())}
            </>
          )}
        </p>
      )}
    </div>
  );
}
