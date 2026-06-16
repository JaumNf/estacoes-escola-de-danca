'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Ticket, Users, User, ArrowRight } from 'lucide-react';

export default function BookingFlow() {
  return (
    <div id="matricula" className="max-w-3xl mx-auto my-12 relative px-4 md:px-0">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 text-[#a04e22] font-semibold hover:text-[#682c0b] transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Voltar para o início
      </Link>
      
      <div className="bg-white rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden p-8 md:p-12 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fffcf5] text-[#d97706] text-sm font-bold tracking-widest uppercase border border-[#fcd34d] mb-6">
          ✨ Lote Promocional
        </span>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3d1c04] mb-4">Garanta seu lugar!</h2>
        <p className="text-[#8c7438] mb-10 text-lg">Faça sua inscrição direto pelo nosso formulário e não fique de fora do Curso Intensivo.</p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex-1 max-w-[280px] mx-auto md:mx-0 shadow-sm hover:shadow-md transition-shadow">
             <User className="text-rose-600 w-10 h-10 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-800 mb-1">Individual</h3>
             <p className="text-4xl font-display font-bold text-[#682c0b]">R$ 25</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex-1 max-w-[280px] mx-auto md:mx-0 shadow-sm hover:shadow-md transition-shadow">
             <Users className="text-rose-600 w-10 h-10 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-800 mb-1">Casal</h3>
             <p className="text-4xl font-display font-bold text-[#682c0b]">R$ 40</p>
          </div>
        </div>

        <a 
          href="https://forms.gle/eNrECUruTq2c2US69" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-[#e11d48] text-white px-8 py-5 rounded-full font-bold tracking-widest uppercase hover:bg-[#be123c] transition-all shadow-lg shadow-rose-900/20 hover:shadow-xl hover:-translate-y-1 w-full md:w-auto text-lg"
        >
          <Ticket size={24} />
          Preencher Formulário de Inscrição
          <ArrowRight size={20} className="hidden md:block" />
        </a>

        <p className="text-sm text-gray-400 mt-8 font-medium">As vagas são limitadas. Inscreva-se agora para não perder sua vaga no lote atual.</p>
      </div>
    </div>
  );
}
