'use client';

import { MotionConfig } from 'motion/react';

/**
 * Padrões de movimento para toda a aplicação.
 *
 * - transition: os ~20 componentes que animam sem passar 'transition' caíam no
 *   spring padrão da biblioteca; passam a usar 200ms com a curva do projeto.
 * - reducedMotion="user": quem ativou "reduzir movimento" no sistema deixa de
 *   receber animações de posição e escala (inclusive as em laço), mas continua
 *   recebendo as de opacidade, que ajudam a entender o que mudou.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </MotionConfig>
  );
}
