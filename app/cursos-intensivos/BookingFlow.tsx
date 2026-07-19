'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ticket, Users, User, ArrowRight, Eye, EyeOff, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BookingFlow() {
  const [showPrices, setShowPrices] = useState(false);

  return (
    <div id="matricula" className="max-w-3xl mx-auto my-12 relative px-4 md:px-0">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 text-[#a04e22] font-semibold hover:text-[#682c0b] transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Voltar para o início
      </Link>
      
      <div className="bg-white rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden p-8 md:p-12 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fffcf5] text-[#d97706] text-sm font-bold tracking-widest uppercase border border-[#fcd34d] mb-6">
          ✨ Segundo Lote
        </span>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3d1c04] mb-4">Garanta seu lugar!</h2>
        <p className="text-[#8c7438] mb-8 text-lg">Faça sua inscrição direto pelo nosso formulário e não fique de fora do Curso Intensivo.</p>

        {!showPrices ? (
          <div className="mb-10 flex justify-center">
            <button 
              onClick={() => setShowPrices(true)}
              className="inline-flex items-center justify-center gap-2 bg-orange-50 text-orange-700 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-orange-100 transition-all shadow-sm border border-orange-200"
            >
              <Tag size={16} />
              <span>Consultar Valores</span>
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto"
          >
            {/* Diária */}
            <div className="bg-orange-50/50 md:bg-orange-50 border border-orange-100 rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-sm">
               <h3 className="text-xl md:text-2xl font-display font-bold text-[#682c0b] mb-4">Diária</h3>
               <div className="flex justify-between items-center bg-white rounded-xl p-4 mb-3 border border-orange-100">
                 <div className="flex items-center gap-2 text-gray-700">
                   <User className="text-orange-500 w-5 h-5" />
                   <span className="font-bold">Por pessoa</span>
                 </div>
                 <span className="text-xl font-display font-bold text-[#682c0b]">R$ 40</span>
               </div>
               <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-orange-100">
                 <div className="flex items-center gap-2 text-gray-700">
                   <Users className="text-orange-500 w-5 h-5" />
                   <span className="font-bold">Por dupla</span>
                 </div>
                 <span className="text-xl font-display font-bold text-[#682c0b]">R$ 60</span>
               </div>
            </div>

            {/* Pacote */}
            <div className="bg-orange-100 md:bg-orange-100/80 border-2 border-orange-300 rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-md relative">
               <div className="absolute -top-3 right-4 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-widest border border-white">
                 MAIS VENDIDO
               </div>
               <h3 className="text-xl md:text-2xl font-display font-bold text-[#682c0b] mb-4">Pacote 3 Dias</h3>
               <div className="flex justify-between items-center bg-white rounded-xl p-4 mb-3 border border-orange-200">
                 <div className="flex items-center gap-2 text-gray-700">
                   <User className="text-orange-600 w-5 h-5" />
                   <div className="flex flex-col text-left">
                     <span className="font-bold leading-tight">Por pessoa</span>
                     <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">+ Baile Incluso</span>
                   </div>
                 </div>
                 <span className="text-xl font-display font-bold text-[#682c0b]">R$ 90</span>
               </div>
               <div className="flex justify-between items-center bg-white rounded-xl p-4 border border-orange-200">
                 <div className="flex items-center gap-2 text-gray-700">
                   <Users className="text-orange-600 w-5 h-5" />
                   <div className="flex flex-col text-left">
                     <span className="font-bold leading-tight">Por dupla</span>
                     <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">+ Baile Incluso</span>
                   </div>
                 </div>
                 <span className="text-xl font-display font-bold text-[#682c0b]">R$ 140</span>
               </div>
            </div>
          </motion.div>
        )}

        <div className="relative inline-block w-full md:w-auto mt-2">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-[#d97706] blur-xl opacity-60 animate-pulse rounded-full"></div>
          <a 
            href="https://forms.gle/eNrECUruTq2c2US69" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-orange-600 to-[#b55d05] text-white px-4 py-4 md:px-12 md:py-6 rounded-full font-bold tracking-wider md:tracking-widest uppercase hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-orange-900/30 hover:shadow-2xl hover:shadow-orange-700/40 w-full md:w-auto text-base md:text-xl border border-orange-500/50 group"
          >
            <Ticket size={24} className="md:w-8 md:h-8 shrink-0 group-hover:-rotate-12 transition-transform duration-300" />
            <span className="whitespace-nowrap">Se inscreva aqui!</span>
            <ArrowRight size={24} className="md:w-8 md:h-8 shrink-0 hidden md:block group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-8 font-medium">As vagas são limitadas. Inscreva-se agora para não perder sua vaga no lote atual.</p>
      </div>
    </div>
  );
}
