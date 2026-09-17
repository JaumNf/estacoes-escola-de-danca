'use client';

import { Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface EdicaoEmBreveProps {
  titulo: string;
  descricao: string;
  /** Link do grupo/comunidade onde a próxima edição será anunciada. */
  href?: string;
  textoBotao?: string;
}

const COMUNIDADE_WHATSAPP = 'https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T';

export default function EdicaoEmBreve({
  titulo,
  descricao,
  href = COMUNIDADE_WHATSAPP,
  textoBotao = 'Quero ser avisado',
}: EdicaoEmBreveProps) {
  return (
    <div className="px-6 py-12 md:py-16 text-center flex flex-col items-center">
      <div className="flex justify-center gap-2 mb-6">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={delay}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Sparkles className="text-[#fbbf24]" size={i === 1 ? 32 : 24} />
          </motion.div>
        ))}
      </div>

      <h3 className="text-3xl md:text-4xl font-display font-bold text-orange-50 mb-4 leading-tight">
        {titulo}
      </h3>

      <p className="text-orange-200 text-lg leading-relaxed max-w-xl mx-auto mb-8">
        {descricao}
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#fbbf24] text-[#682c0b] px-8 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#f59e0b] shadow-xl transition-colors duration-300 inline-flex items-center gap-2"
      >
        {textoBotao} <MessageCircle size={20} />
      </a>
    </div>
  );
}
