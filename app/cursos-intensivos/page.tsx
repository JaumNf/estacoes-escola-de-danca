'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import Tooltip from '@/components/Tooltip';
import { Calendar, MapPin, Clock, ArrowRight, Check, Sparkles, Trophy, Heart, Music, Star, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import BookingFlow from './BookingFlow';
import Countdown from './Countdown';
import Footer from '@/components/Footer';


const RITMOS_OPCOES = [
  { id: 'vanera_zero', nome: 'Vanera', nivel: 'Iniciante', dia: '22 de Maio', hora: '18h30 às 19h40' },
  { id: 'bachata_zero', nome: 'Bachata', nivel: 'Do zero', dia: '22 de Maio', hora: '19h40 às 20h50' },
  { id: 'zouk_zero', nome: 'Zouk', nivel: 'Do zero', dia: '22 de Maio', hora: '20h50 às 22h00' },
  { id: 'forro_zero', nome: 'Forró', nivel: 'Do zero', dia: '23 de Maio', hora: '14h30 às 15h40' },
  { id: 'forro_iniciante', nome: 'Forró', nivel: 'Iniciante', dia: '23 de Maio', hora: '15h40 às 16h50' },
  { id: 'samba_zero', nome: 'Musicalidade e possibilidades na dança', nivel: 'Livre', dia: '23 de Maio', hora: '16h50 às 18h00' },
];

export default function CursosIntensivos() {
  const [cursosSelecionados, setCursosSelecionados] = useState<string[]>([]);

  const toggleCurso = (id: string) => {
    setCursosSelecionados(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const [tipoInscricao, setTipoInscricao] = useState<'individual' | 'dupla'>('individual');
  const [isUniversitario, setIsUniversitario] = useState(false);
  const [nome, setNome] = useState('');
  const [nomeDupla, setNomeDupla] = useState('');

  const getValorDetails = () => {
    const baseValue = cursosSelecionados.length * (tipoInscricao === 'individual' ? 35 : 50);
    let discountPercent = 0;
    
    if (cursosSelecionados.length >= 5) {
      discountPercent = 10;
    } else if (cursosSelecionados.length === 4) {
      discountPercent = 7.5;
    } else if (cursosSelecionados.length === 3) {
      discountPercent = 5;
    }
    
    const discountAmount = baseValue * (discountPercent / 100);
    const finalValue = baseValue - discountAmount;
    
    return {
       baseValue,
       discountPercent,
       discountAmount,
       finalValue
    };
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    
    let mensagem = `Olá! Gostaria de me matricular nos cursos intensivos.%0A%0A`;
    
    const ritmosNomes = cursosSelecionados.map(id => {
      const ritmo = RITMOS_OPCOES.find(r => r.id === id);
      return ritmo ? `${ritmo.nome} (${ritmo.nivel})` : id;
    });

    mensagem += `*Ritmos Selecionados:* ${ritmosNomes.length > 0 ? ritmosNomes.join(', ') : 'Nenhum'}%0A`;
    mensagem += `*Tipo de Inscrição:* ${tipoInscricao === 'individual' ? 'Individual' : 'Em Dupla'}%0A`;
    mensagem += `*Universitário:* ${isUniversitario ? 'Sim' : 'Não'}%0A`;
    
    if (tipoInscricao === 'individual') {
      mensagem += `*Nome:* ${nome}%0A`;
    } else {
      mensagem += `*Nome da Dupla:* ${nomeDupla}%0A`;
    }
    
    const whatsappUrl = `https://wa.me/5567992630948?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-orange-50 relative">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#120400] text-orange-50 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/d/1URzYQjUA6RL0bn783UvqPyQ2txodm-kB"
            alt="Dançar não é um bicho de sete cabeças"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120400] via-black/40 to-transparent pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto text-center relative z-10 px-6 py-24 flex flex-col items-center justify-center h-full">
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight mt-8">
            Dançar não é um bicho<br className="hidden md:block"/> de sete cabeças.
          </h1>
          
          <p className="text-xl md:text-2xl text-[#fcd34d] font-bold max-w-2xl mx-auto mb-10">
            É mais fácil quando você dá o primeiro passo.
          </p>
          
          {/* Countdown Timer */}
          <Countdown />

          <button 
            onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#fbbf24] text-[#682c0b] px-8 py-5 rounded-xl font-bold tracking-widest hover:bg-[#f59e0b] shadow-xl transition-all duration-300 w-full md:w-auto mt-4 text-lg md:text-xl uppercase"
          >
            GARANTIR MINHA VAGA
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full z-20">
          <WaveDivider position="bottom" colorClass="fill-orange-50" />
        </div>
      </section>

      {/* Filosofia Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative py-24 px-6 bg-orange-50"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          
          {/* Text Side */}
          <div className="space-y-6 text-left order-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#682c0b] leading-tight mb-4 shrink-0">
              Mais do que passos:<br /> confiança e movimento<br /> para todos.
            </h2>
            
            <p className="text-[#645c58] text-lg md:text-xl leading-relaxed font-medium shrink-0">
              Acreditamos que a dança não deve ser difícil; o passo mais desafiador é simplesmente vir praticar.
            </p>
            
            <p className="text-[#645c58] text-lg md:text-xl leading-relaxed font-medium shrink-0">
              Nosso ambiente é pensado para que ninguém fique de fora: acolhemos quem nunca dançou com segurança e desafiamos quem já dança a evoluir.
            </p>

            <blockquote className="bg-[#fcf8f2] border-l-[4px] border-[#e45a1c] p-4 text-[#c45424] font-medium italic text-lg md:text-xl rounded-r-lg shadow-sm my-4 shrink-0">
              &quot;Priorizamos o movimento sobre a teoria e a diversão sobre a rigidez.&quot;
            </blockquote>

            <p className="text-[#645c58] text-base leading-relaxed font-medium">
              Queremos que cada aluno saia daqui se sentindo capaz, leve e parte de uma comunidade vibrante. Para nós, quando a experiência é prazerosa e o ambiente é acolhedor, aprender acontece naturalmente.
            </p>
          </div>

          {/* Image Side */}
          <div className="relative h-[300px] md:h-[600px] w-full mb-8 md:mb-0 block order-2">
            {/* Background Shape */}
            <div className="absolute top-4 -right-4 md:top-8 md:-right-8 w-full h-[80%] bg-[#e8a32a] rounded-[40px] md:rounded-[60px]" />
            <div className="relative h-[80%] w-full rounded-[40px] md:rounded-[60px] overflow-hidden border-4 border-orange-50 bg-gray-200">
              <Image 
                src="https://i.ibb.co/5XDbwVrd/Screenshot-20260129-194726-Instagram-2.jpg" 
                alt="Turma Estações" 
                fill 
                loading="lazy"
                className="object-cover" 
                unoptimized
              />
            </div>
          </div>

        </div>
      </motion.section>

      {/* Cronograma Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative py-24 px-6 bg-orange-50/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center shrink-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#682c0b] mb-4">A Jornada Intensiva</h2>
            <p className="text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto">
              2 dias intensos de dança e conexão. Organize sua agenda para não perder nada.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              
              {/* Day 1 */}
              <div className="bg-[#fae8d4] relative rounded-[32px] p-8 lg:p-10 shadow-lg border border-black/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#e5e7eb] rounded-full border border-black/10 shadow-sm z-20" />
                
                <div className="text-center mb-4 mt-1">
                  <h3 className="text-3xl font-display font-bold text-[#682c0b]">22 MAI</h3>
                  <p className="text-[#c45424] text-xs font-bold tracking-widest uppercase mt-1">Sexta-feira</p>
                </div>
                
                <div className="w-full h-px bg-black/5 mb-4" />
                
                <div className="flex flex-col gap-3 flex-1">
                  
                  {/* Class 1 */}
                  <button 
                    onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left bg-white/80 rounded-[20px] p-4 shadow-sm border border-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-2 text-[#a04e22] text-xs font-bold mb-1">
                      <Clock size={14} />
                      <span>18:30 às 19:40</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#682c0b] mb-2">Vanera</h4>
                    <div className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Iniciante
                    </div>
                  </button>

                  {/* Class 2 */}
                  <button 
                    onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left bg-white/80 rounded-[20px] p-4 shadow-sm border border-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-2 text-[#a04e22] text-xs font-bold mb-1">
                      <Clock size={14} />
                      <span>19:40 às 20:50</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#682c0b] mb-2">Bachata</h4>
                    <div className="inline-block px-3 py-1 bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Do Zero
                    </div>
                  </button>

                  {/* Class 3 */}
                  <button 
                    onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left bg-white/80 rounded-[20px] p-4 shadow-sm border border-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-2 text-[#a04e22] text-xs font-bold mb-1">
                      <Clock size={14} />
                      <span>20:50 às 22:00</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#682c0b] mb-2">Zouk</h4>
                    <div className="inline-block px-3 py-1 bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Do Zero
                    </div>
                  </button>

                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-[#fcfade] relative rounded-[32px] p-8 lg:p-10 shadow-lg border border-black/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#e5e7eb] rounded-full border border-black/10 shadow-sm z-20" />
                
                <div className="text-center mb-4 mt-1">
                  <h3 className="text-3xl font-display font-bold text-[#682c0b]">23 MAI</h3>
                  <p className="text-[#a1991d] text-xs font-bold tracking-widest uppercase mt-1">Sábado</p>
                </div>
                
                <div className="w-full h-px bg-black/5 mb-4" />
                
                <div className="flex flex-col gap-3 flex-1">
                  
                  {/* Class 1 */}
                  <button 
                    onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left bg-white/80 rounded-[20px] p-4 shadow-sm border border-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-2 text-[#8c8511] text-xs font-bold mb-1">
                      <Clock size={14} />
                      <span>14:30 às 15:40</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#682c0b] mb-2">Forró</h4>
                    <div className="inline-block px-3 py-1 bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Do Zero
                    </div>
                  </button>

                  {/* Class 2 */}
                  <button 
                    onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left bg-white/80 rounded-[20px] p-4 shadow-sm border border-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-2 text-[#8c8511] text-xs font-bold mb-1">
                      <Clock size={14} />
                      <span>15:40 às 16:50</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#682c0b] mb-2">Forró</h4>
                    <div className="inline-block px-3 py-1 bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Iniciante
                    </div>
                  </button>

                  {/* Class 3 */}
                  <button 
                    onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left bg-white/80 rounded-[20px] p-4 shadow-sm border border-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-2 text-[#8c8511] text-xs font-bold mb-1">
                      <Clock size={14} />
                      <span>16:50 às 18:00</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#682c0b] mb-2 leading-tight">Musicalidade e possibilidades na dança</h4>
                    <div className="inline-block px-3 py-1 bg-[#f3e8ff] text-[#9333ea] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                      Livre
                    </div>
                  </button>

                  {/* Class 4 Removed */}

                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.section>

      {/* Festa, Arte e Liberdade */}
      <section className="relative py-24 w-full bg-[#e45a1c]">
        {/* Soft Wave Top */}
        <svg viewBox="0 0 1440 100" className="absolute top-0 left-0 w-full h-[4vh] md:h-[4vh] -translate-y-[99%] text-[#e45a1c] fill-current preserve-3d" preserveAspectRatio="none">
          <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" />
        </svg>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 shrink-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 uppercase tracking-wide">
              Festa, Arte e Liberdade
            </h2>
            <p className="text-lg md:text-xl text-orange-100 font-medium max-w-2xl mx-auto">
              Mergulhe na folia criativa e no aprendizado divertido.
            </p>
            <p className="text-orange-200 text-xs mt-3 font-bold uppercase tracking-widest animate-pulse">Arraste para os lados para ver mais</p>
          </div>

          <FestaCarousel />
        </div>

        {/* Soft Wave Bottom */}
        <svg viewBox="0 0 1440 100" className="absolute bottom-0 left-0 w-full h-[4vh] md:h-[4vh] translate-y-[99%] text-[#e45a1c] fill-current preserve-3d" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,50 Q1080,0 720,50 T0,50 Z" />
        </svg>
      </section>

      {/* Localização e Práticas */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative py-24 px-6 bg-orange-50/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center shrink-0">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4">Espaço do evento</h2>
            <p className="text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto">
              Fácil de chegar, impossível de não se apaixonar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Localização Exata */}
            <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-4 shrink-0">
                <div className="w-12 h-12 bg-[#e45a1c] rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-[#682c0b]">Localização</h3>
                  <p className="text-gray-500 font-bold tracking-widest uppercase text-[9px]">Unidade 1 - Centro</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-3 shrink-0">
                 <div className="mt-1">
                   <MapPin size={16} className="text-[#d97706]" />
                 </div>
                 <div>
                   <p className="text-sm text-[#645c58] font-medium">Rua Barão de Melgaço, 177</p>
                 </div>
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-100 mb-4 min-h-[150px] relative">
                <iframe 
                  src="https://maps.google.com/maps?q=Rua%20Bar%C3%A3o%20de%20Melga%C3%A7o%2C%20177%2C%20Campo%20Grande%20-%20MS&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0"
                ></iframe>
              </div>

              <a href="https://maps.google.com/?q=Rua+Barao+de+Melgaco,+177,+Campo+Grande+-+MS" target="_blank" rel="noopener noreferrer" className="w-full bg-[#e45a1c] text-white font-bold py-3 rounded-xl hover:bg-[#c45424] transition-colors flex justify-center items-center gap-2 shrink-0 text-sm">
                <MapPin size={18} /> TRAÇAR ROTA
              </a>
            </div>

            {/* Tira Dúvidas */}
            <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8 flex flex-col">
              <h3 className="text-2xl font-display font-bold text-[#682c0b] mb-6">Tira Dúvidas</h3>
              
              <div className="space-y-6 flex-1">
                <div className="relative pl-4 border-l-2 border-[#e45a1c]/30">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#e45a1c]" />
                  <h4 className="text-[#c45424] font-bold mb-1 text-sm">Preciso saber dançar?</h4>
                  <p className="text-gray-500 text-xs shadow-none">Não. O curso é para iniciantes e experiêntes.</p>
                </div>

                <div className="relative pl-4 border-l-2 border-[#e45a1c]/30">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#e45a1c]" />
                  <h4 className="text-[#c45424] font-bold mb-1 text-sm">Preciso levar parceiro(a)?</h4>
                  <p className="text-gray-500 text-xs">Não precisa. Pode vir sozinho(a).</p>
                </div>

                <div className="relative pl-4 border-l-2 border-[#e45a1c]/30">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#e45a1c]" />
                  <h4 className="text-[#c45424] font-bold mb-1 text-sm">As aulas são difíceis?</h4>
                  <p className="text-gray-500 text-xs">Não. São divertidas e respeitam seu tempo.</p>
                </div>

                <div className="relative pl-4 border-l-2 border-[#e45a1c]/30">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#e45a1c]" />
                  <h4 className="text-[#c45424] font-bold mb-1 text-sm">Que roupa usar?</h4>
                  <p className="text-gray-500 text-xs">Roupas confortáveis que não limitem o movimento.</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center shrink-0">
                <a 
                  href="https://wa.me/5567992630948" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-full border-2 border-green-200 text-green-600 font-bold hover:bg-green-50 transition-colors text-sm"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Matrícula / Seleção de Aulas */}
      <section 
        id="matricula"
        className="relative py-24 px-6 bg-[#3d1c04]"
      >
        <WaveDivider position="top" colorClass="fill-[#3d1c04]" />
        <div className="max-w-6xl mx-auto relative z-10">
        <div className="w-full bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm">
           <BookingFlow ritmos={RITMOS_OPCOES} />
        </div>
      </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-6 bg-[#fffdf0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 shrink-0">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4">O que dizem os alunos</h2>
            <p className="text-orange-950/60 text-xs mt-3 font-bold uppercase tracking-widest animate-pulse">Arraste para os lados para ler mais</p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Footer Minimal */}
      <Footer />
      


    </main>
  );
}

function FestaCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' }, 
    [Autoplay({ delay: 10000, stopOnInteraction: false })]
  );
  
  const cards = [
    {
      titleTop: 'Conforto e',
      titleBottom: 'Confiança.',
      icon: <Heart className="text-[#ea5d35] w-8 h-8 fill-current shrink-0 ml-2" />,
      desc: 'Você aprende desde a base. Com menos vergonha e mais segurança pra se soltar e curtir.'
    },
    {
      titleTop: 'Leve e',
      titleBottom: 'Divertido.',
      icon: <Music className="text-[#ea5d35] w-8 h-8 fill-current shrink-0 ml-2" />,
      desc: 'Aulas dinâmicas que respeitam seu ritmo e trazem a alegria da arte para o seu dia.'
    },
    {
      titleTop: 'Vontade de',
      titleBottom: 'Continuar.',
      icon: <Star className="text-[#ea5d35] w-8 h-8 fill-current shrink-0 ml-2" />,
      desc: 'O sentimento de conquista ao final de cada aula vai te motivar a ir além.'
    }
  ];

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full mt-12 relative z-10 pb-4" ref={emblaRef}>
      <div className="flex">
        {cards.map((card, idx) => (
          <div className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_33.333333%] min-w-0 pr-6" key={idx}>
            <div className="bg-[#fff7d6] border-4 border-[#ffb100] rounded-[32px] p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-[#8a2f07] leading-tight">
                  {card.titleTop}<br/>{card.titleBottom}
                </h3>
                {card.icon}
              </div>
              <p className="text-[#8a2f07]/80 text-lg md:text-xl font-medium leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start' }, 
    [Autoplay({ delay: 10000, stopOnInteraction: false })]
  );

  const testimonials = [
    {
      img: 'https://i.pravatar.cc/150?img=32',
      name: 'Mariana Silva',
      text: '"Participar do intensivo foi um divisor de águas pra mim! O ambiente é super acolhedor e os professores explicam de um jeito muito didático. Em apenas um fim de semana consegui pegar a base e já dancei no baile. Recomendo muito!"'
    },
    {
      img: 'https://i.pravatar.cc/150?img=33',
      name: 'Carlos Eduardo',
      text: '"Eu achava que nunca ia aprender a dançar, sou muito duro! Mas a didática da Estações me fez soltar e perder a vergonha. A turma era super animada e agora não quero mais parar as aulas. Valeu cada centavo!"'
    },
    {
      img: 'https://i.pravatar.cc/150?img=34',
      name: 'Luciana Marques',
      text: '"Uma experiência fantástica! Consegui aprender vários ritmos e a interagir com muitas pessoas legais. A energia do lugar é surreal, recomendo para qualquer um que quer dar os primeiros passos."'
    }
  ];

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full pb-8" ref={emblaRef}>
      <div className="flex">
        {testimonials.map((test, idx) => (
          <div className="flex-[0_0_90%] md:flex-[0_0_45%] xl:flex-[0_0_33.333333%] min-w-0 pr-6" key={idx}>
            <div className="bg-white p-8 rounded-[32px] shadow-lg border border-orange-50 hover:-translate-y-2 transition-transform duration-300 flex flex-col gap-6 h-full">
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#fae8d4] overflow-hidden relative">
                  <Image src={test.img} alt="Aluno" fill loading="lazy" className="object-cover" unoptimized/>
                </div>
                <div>
                  <h4 className="font-bold text-[#a04e22] text-xl">{test.name}</h4>
                </div>
              </div>
              <p className="text-[#a04e22] italic leading-relaxed text-lg">{test.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
