'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';
import { Calendar, MapPin, Clock, ArrowRight, User, Users, X, Info, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function CursosIntensivos() {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 3000); // 3 seconds timeout requested
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  return (
    <main className="min-h-screen bg-orange-50 relative flex flex-col">
      <Header />
      
      {/* Blurred Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/90 p-8 md:p-12 rounded-[32px] shadow-2xl text-center max-w-2xl mx-4 border border-orange-200 relative"
            >
              <button 
                onClick={() => setShowOverlay(false)}
                className="absolute top-4 right-4 p-2 bg-orange-100 text-orange-900 rounded-full hover:bg-orange-200 transition-colors"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl md:text-5xl font-display font-bold text-orange-900 mb-4 mt-2">
                Traremos mais informações futuramente!
              </h2>
              <p className="text-orange-700 text-lg md:text-xl mb-6">
                Aguarde as novidades sobre o nosso próximo curso intensivo.
              </p>
              
              <Link 
                href="/"
                className="inline-flex bg-orange-600 text-white px-8 py-3 rounded-full font-bold tracking-wide hover:bg-orange-700 transition-colors shadow-lg"
              >
                Voltar ao Início
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-700 ${showOverlay ? 'pointer-events-none select-none filter blur-[4px]' : ''}`}>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#120400] text-orange-50 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://lh3.googleusercontent.com/d/1URzYQjUA6RL0bn783UvqPyQ2txodm-kB"
              alt="Curso de Inverno - Estações"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120400] via-black/40 to-transparent pointer-events-none" />

          <div className="max-w-4xl w-full mx-auto text-center relative z-10 px-6 py-16 flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight mt-8">
              Curso de Inverno:<br className="hidden md:block"/> 1ª Edição
            </h1>
            <p className="text-xl md:text-2xl text-[#fcd34d] font-bold max-w-2xl mx-auto mb-10">
              Dias 23, 24 e 25 de Julho. Venha aquecer o inverno dançando com a gente!
            </p>
            
            <div className="flex gap-4 md:gap-8 justify-center mb-8 flex-wrap">
              <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/20 flex flex-col items-center min-w-[100px]">
                <Calendar className="text-[#fcd34d] mb-2" size={28} />
                <span className="font-bold text-lg md:text-xl">Julho</span>
                <span className="text-sm text-orange-200">23 a 25</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/20 flex flex-col items-center min-w-[100px]">
                <MapPin className="text-[#fcd34d] mb-2" size={28} />
                <span className="font-bold text-lg md:text-xl">Estações</span>
                <span className="text-sm text-orange-200">R. 15 de Nov, 501</span>
              </div>
            </div>
            
            <a href="#matricula" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-[#b55d05] text-white px-8 py-4 rounded-full font-bold tracking-widest uppercase hover:scale-[1.05] transition-all shadow-xl shadow-orange-900/30">
              Garantir Minha Vaga <ArrowRight size={20} />
            </a>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full z-20">
            <WaveDivider position="bottom" colorClass="fill-orange-50" />
          </div>
        </section>

        {/* Sobre o Curso */}
        <section className="py-24 px-6 bg-orange-50 relative">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 relative">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://lh3.googleusercontent.com/d/1vCmr8y6K9e6Y1XyXf2T8V_4E480wUe8k"
                  alt="Alunos dançando forró"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl rotate-[-6deg] max-w-[200px] border border-orange-100">
                <p className="font-display font-bold text-[#682c0b] text-xl">
                  "A melhor forma de espantar o frio!"
                </p>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-6">
                O que é o Curso de Inverno?
              </h2>
              <div className="space-y-6 text-lg text-orange-900/80 leading-relaxed">
                <p>
                  O Curso de Inverno da Estações é um intensivo pensado para quem quer dar os primeiros passos na dança de salão, aquecer o corpo e fazer novas amizades.
                </p>
                <p>
                  Durante três dias, você vai mergulhar nos ritmos mais gostosos para dançar juntinho, com professores experientes e uma metodologia focada na diversão e no aprendizado prático.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-orange-100/50 p-4 rounded-2xl border border-orange-200">
                    <h4 className="font-bold text-[#a04e22] mb-1">Iniciantes</h4>
                    <p className="text-sm">Comece do zero sem medo</p>
                  </div>
                  <div className="bg-orange-100/50 p-4 rounded-2xl border border-orange-200">
                    <h4 className="font-bold text-[#a04e22] mb-1">Sem Par</h4>
                    <p className="text-sm">Não precisa trazer dupla</p>
                  </div>
                  <div className="bg-orange-100/50 p-4 rounded-2xl border border-orange-200">
                    <h4 className="font-bold text-[#a04e22] mb-1">3 Ritmos</h4>
                    <p className="text-sm">Forró, Sertanejo e Zouk</p>
                  </div>
                  <div className="bg-orange-100/50 p-4 rounded-2xl border border-orange-200">
                    <h4 className="font-bold text-[#a04e22] mb-1">Baile Incluso</h4>
                    <p className="text-sm">Pratique tudo no final</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing/Booking Section */}
        <section id="matricula" className="py-24 px-6 bg-[#fffdf0] relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-[#3d1c04] mb-12 text-center">
              Garanta seu lugar!
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-orange-200 shadow-lg hover:-translate-y-1 transition-transform">
                <h3 className="text-2xl font-bold text-[#682c0b] mb-4">Diária</h3>
                <p className="text-orange-800 mb-6 text-sm">Escolha 1 dia específico para participar.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-200 p-2 rounded-lg text-orange-700">
                        <User size={20} />
                      </div>
                      <span className="font-medium text-orange-900">Por pessoa</span>
                    </div>
                    <span className="text-xl font-bold text-[#682c0b]">R$ 45</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-200 p-2 rounded-lg text-orange-700">
                        <Users size={20} />
                      </div>
                      <span className="font-medium text-orange-900">Por dupla</span>
                    </div>
                    <span className="text-xl font-bold text-[#682c0b]">R$ 65</span>
                  </div>
                </div>
                
                <a href="https://forms.gle/eNrECUruTq2c2US69" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors">
                  Inscrever para Diária
                </a>
              </div>
              
              <div className="bg-orange-100 rounded-3xl p-8 border-2 border-orange-400 shadow-xl relative hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 right-8 bg-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Mais Vantajoso
                </div>
                
                <h3 className="text-2xl font-bold text-[#682c0b] mb-4">Pacote 3 Dias</h3>
                <p className="text-orange-800 mb-6 text-sm">Acesso completo a todos os dias + Baile de encerramento.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-orange-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg text-orange-700">
                        <User size={20} />
                      </div>
                      <span className="font-medium text-orange-900">Por pessoa</span>
                    </div>
                    <span className="text-xl font-bold text-[#682c0b]">R$ 100</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-orange-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg text-orange-700">
                        <Users size={20} />
                      </div>
                      <span className="font-medium text-orange-900">Por dupla</span>
                    </div>
                    <span className="text-xl font-bold text-[#682c0b]">R$ 150</span>
                  </div>
                </div>
                
                <a href="https://forms.gle/eNrECUruTq2c2US69" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-orange-700 text-white font-bold py-4 rounded-xl hover:bg-orange-800 transition-colors shadow-lg">
                  Garantir Pacote Completo
                </a>
              </div>
            </div>
            
            <div className="mt-12 bg-orange-50 border border-orange-200 rounded-2xl p-6 flex gap-4 items-start">
              <Info className="text-orange-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-orange-900 mb-1">Informações Importantes</h4>
                <p className="text-sm text-orange-800">
                  O preenchimento do formulário não garante a vaga. A inscrição só é confirmada após o envio do comprovante de pagamento via WhatsApp. Vagas limitadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Simples */}
        <section className="py-24 px-6 bg-orange-50 relative">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-4">Dúvidas Frequentes</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-orange-100">
                <h4 className="text-orange-800 font-bold mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-orange-400" /> Preciso saber dançar?
                </h4>
                <p className="text-sm text-gray-600">Não! O curso é focado em iniciantes e começaremos do absoluto zero.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-orange-100">
                <h4 className="text-orange-800 font-bold mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-orange-400" /> Preciso levar parceiro(a)?
                </h4>
                <p className="text-sm text-gray-600">Não é obrigatório. Fazemos revezamento durante as aulas para que todos dancem.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-orange-100">
                <h4 className="text-orange-800 font-bold mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-orange-400" /> Que roupa eu uso?
                </h4>
                <p className="text-sm text-gray-600">Roupas e calçados confortáveis que permitam movimento (tênis é ótimo, evite salto alto se não tiver costume).</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-orange-100">
                <h4 className="text-orange-800 font-bold mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-orange-400" /> Onde é a escola?
                </h4>
                <p className="text-sm text-gray-600">Ficamos na R. 15 de Novembro, 501, no centro, bem fácil de achar!</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <a href="https://wa.me/5567992630948?text=Ol%C3%A1%21%20Tenho%20uma%20d%C3%BAvida%20sobre%20o%20Curso%20de%20Inverno." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-800 transition-colors">
                Ainda tem dúvidas? Fale conosco no WhatsApp <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
