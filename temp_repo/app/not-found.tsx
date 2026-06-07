'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brown-50 flex flex-col font-body">
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-ochre/5 rounded-full blur-3xl"></div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
            className="text-[150px] md:text-[200px] font-display font-black text-brown-900/10 leading-none mb-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none"
          >
            404
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-display font-bold text-brown-950 mb-6"
          >
            Ops! Você pisou fora do compasso.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-brown-800 mb-10 max-w-lg mx-auto"
          >
            Essa página parece ter ido dançar em outro salão. Mas não se preocupe, a gente te leva de volta para a pista!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-terracotta text-white rounded-full font-bold text-lg hover:bg-ochre transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Voltar para o Início
            </Link>
          </motion.div>
        </div>
      </main>

      <WaveDivider position="bottom" colorClass="fill-brown-950" />
      <Footer />
    </div>
  );
}
