'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    src: '/images/herocarousel-movimente-se-com-confianca.webp',
    alt: 'Dançarinos em movimento',
    title: 'Movimente-se com Confiança',
    subtitle: 'Mais do que passos, desenvolva consciência corporal, conexão e o prazer em dançar.',
  },
  {
    src: '/images/herocarousel-para-todos-os-niveis.webp',
    alt: 'Aula de dança',
    title: 'Para Todos os Níveis',
    subtitle: 'Comece do zero ou encontre novos desafios. O foco é a vontade de viver algo novo.',
  },
  {
    src: '/images/herocarousel-conexao-e-diversao.webp',
    alt: 'Apresentação de dança',
    title: 'Conexão e Diversão',
    subtitle: 'Um ambiente leve onde a gente se diverte, ri e compartilha momentos inesquecíveis.',
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-brown-950">
      {/* Animated Images */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={idx === 0}
            loading={idx === 0 ? undefined : "lazy"}
          />
        </div>
      ))}

      {/* Static Overlays - Prevents background flickering */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      
      {/* Animated Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full max-w-7xl mx-auto mt-20"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              {images[currentIndex].title}
            </h1>
            <p className="text-xl md:text-2xl text-white font-body max-w-2xl mx-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-10 font-medium px-4">
              {images[currentIndex].subtitle}
            </p>
            <div className="pointer-events-auto flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#trabalhos"
                className="pressable bg-transparent border border-white/50 text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-white/10 shadow-lg backdrop-blur-sm"
              >
                Conheça a Escola
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={prev}
        className="pressable-sm absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-brown-300/30 flex items-center justify-center text-brown-100 hover:bg-brown-800/50 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="pressable-sm absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-brown-300/30 flex items-center justify-center text-brown-100 hover:bg-brown-800/50 z-10"
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-[width,background-color] duration-200 ${
              idx === currentIndex ? 'bg-terracotta w-8' : 'bg-brown-300/50 hover:bg-brown-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
