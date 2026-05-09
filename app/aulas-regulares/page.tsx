'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import Tooltip from '@/components/Tooltip';
import { Calendar, MapPin, Clock, ArrowRight, Check, CheckCircle, Instagram, Facebook, User, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import BackToTop from '@/components/BackToTop';

export default function AulasRegulares() {
  const [unidade, setUnidade] = useState<'unidade1' | 'unidade2'>('unidade1');
  const [turmaPrincipal, setTurmaPrincipal] = useState('');
  const [tipoInscricao, setTipoInscricao] = useState<'individual' | 'dupla'>('individual');
  const [isUniversitario, setIsUniversitario] = useState(false);
  const [querSegundaTurma, setQuerSegundaTurma] = useState(false);
  const [segundaTurma, setSegundaTurma] = useState('');
  const [nome, setNome] = useState('');
  const [nomeDupla, setNomeDupla] = useState('');

  const calcularValor = () => {
    let valorBase = 0;
    if (isUniversitario) {
      valorBase = tipoInscricao === 'individual' ? 100 : 150;
    } else {
      valorBase = tipoInscricao === 'individual' ? 120 : 180;
    }

    if (querSegundaTurma) {
      // Segunda turma sai pela metade do preço da modalidade escolhida
      valorBase += valorBase / 2;
    }

    return valorBase;
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    
    let mensagem = `Olá! Gostaria de me matricular nas aulas regulares.%0A%0A`;
    mensagem += `*Unidade:* ${unidade === 'unidade1' ? 'Unidade 1 - Teatro do Mundo' : 'Unidade 2 - Templo'}%0A`;
    if (unidade === 'unidade1' && turmaPrincipal) {
      mensagem += `*Turma Principal:* ${turmaPrincipal}%0A`;
    }
    mensagem += `*Tipo de Inscrição:* ${tipoInscricao === 'individual' ? 'Individual' : 'Em Dupla'}%0A`;
    mensagem += `*Universitário:* ${isUniversitario ? 'Sim' : 'Não'}%0A`;
    if (querSegundaTurma) {
      mensagem += `*Turma Adicional (50% OFF):* Sim - ${segundaTurma}%0A`;
    }
    if (tipoInscricao === 'individual') {
      mensagem += `*Nome:* ${nome}%0A`;
    } else {
      mensagem += `*Nome da Dupla:* ${nomeDupla}%0A`;
    }
    
    const whatsappUrl = `https://wa.me/5567992630948?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-orange-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-[#120400] text-orange-50 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/d/1mPdWjaRxmRZOiSJ-A3ttHvc3n-eL1-47"
            alt="Aulas Regulares"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
            unoptimized
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120400]/80 via-black/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-lg">Aulas Regulares</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-10 drop-shadow-md">
            Aprenda a dançar do zero ao baile com a nossa metodologia acolhedora e focada na sua evolução.
          </p>
          <button 
            onClick={() => document.getElementById('horarios')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-orange-600 text-orange-50 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-orange-800 transition-colors duration-300 shadow-lg inline-flex items-center gap-2"
          >
            Quero Começar <ArrowRight size={20} />
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
        className="py-24 px-6"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-900">Nossa Filosofia</h2>
          <div className="w-24 h-1.5 bg-orange-600 mx-auto rounded-full"></div>
          <p className="text-lg md:text-xl text-orange-800 leading-relaxed">
            Acreditamos que todo mundo nasceu para dançar. Nossas aulas regulares são construídas para que você desenvolva sua consciência corporal, musicalidade e, acima de tudo, o prazer em dançar. Não importa se você nunca deu um passo de dança na vida ou se já tem alguma experiência, nosso ambiente é livre de julgamentos, acolhedor e focado em fazer você se sentir confiante no salão.
          </p>
        </div>
      </motion.section>

      {/* Horários Section */}
      <motion.section 
        id="horarios"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-6 bg-orange-100/30"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-900 mb-6">Horários e Turmas</h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto mb-8">
              Encontre a turma perfeita para a sua rotina.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-bold tracking-wide uppercase text-orange-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-900 border-2 border-orange-400">1</span>
                <span>Escolha sua Turma</span>
              </div>
              <ArrowRight className="hidden md:block text-orange-400" size={16} />
              <div className="flex items-center gap-2 opacity-70">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">2</span>
                <span>Selecione o Plano</span>
              </div>
              <ArrowRight className="hidden md:block text-orange-400" size={16} />
              <div className="flex items-center gap-2 opacity-70">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">3</span>
                <span>Finalize a Matrícula</span>
              </div>
            </div>
            <p className="text-orange-600 mt-6 text-sm font-medium animate-pulse">
              👇 Clique na turma desejada nas caixas abaixo para iniciar a sua matrícula!
            </p>
          </div>

          <div className="group bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-orange-900/5 border border-orange-100 hover:-translate-y-2 hover:shadow-2xl hover:border-fuchsia-500 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8 border-b border-orange-100 pb-6">
              <div className="w-12 h-12 rounded-full border-2 border-orange-600 group-hover:border-fuchsia-500 flex items-center justify-center shrink-0 transition-colors duration-300">
                <MapPin className="text-orange-600 group-hover:text-fuchsia-500 transition-colors duration-300" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-orange-900 group-hover:text-fuchsia-600 transition-colors duration-300">UNIDADE 1: Teatro do Mundo - Terça-feira</h3>
              </div>
            </div>

            <div className="space-y-8">
              <button 
                onClick={() => {
                  setUnidade('unidade1');
                  setTurmaPrincipal('Vanera e Chamamé');
                  document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl hover:bg-orange-50 transition-all duration-200 active:scale-[0.98] group/item"
              >
                <div className="flex items-center gap-3 min-w-[180px]">
                  <Clock className="text-orange-600" size={24} />
                  <span className="text-xl font-bold text-orange-600">18h20 - 19h20</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-orange-900 group-hover/item:text-orange-600 transition-colors">Vanera e Chamamé</h4>
                  <p className="text-orange-700">Do zero</p>
                </div>
                <ArrowRight className="text-orange-300 group-hover/item:text-orange-600 transition-all group-hover/item:translate-x-2" size={24} />
              </button>

              <button 
                onClick={() => {
                  setUnidade('unidade1');
                  setTurmaPrincipal('Forró');
                  document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl hover:bg-orange-50 transition-all duration-200 active:scale-[0.98] group/item"
              >
                <div className="flex items-center gap-3 min-w-[180px]">
                  <Clock className="text-orange-600" size={24} />
                  <span className="text-xl font-bold text-orange-600">19h30 - 20h30</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-orange-900 group-hover/item:text-orange-600 transition-colors">Forró</h4>
                  <p className="text-orange-700">Do zero</p>
                </div>
                <ArrowRight className="text-orange-300 group-hover/item:text-orange-600 transition-all group-hover/item:translate-x-2" size={24} />
              </button>
            </div>
          </div>

          <div className="group bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-orange-900/5 border border-orange-100 hover:-translate-y-2 hover:shadow-2xl hover:border-fuchsia-500 transition-all duration-300 mt-8 relative">
            <div className="absolute -top-4 -right-4 bg-fuchsia-500 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg transform rotate-12 z-10">NOVIDADE!</div>
            <div className="flex items-center gap-4 mb-8 border-b border-orange-100 pb-6">
              <div className="w-12 h-12 rounded-full border-2 border-orange-600 group-hover:border-fuchsia-500 flex items-center justify-center shrink-0 transition-colors duration-300">
                <MapPin className="text-orange-600 group-hover:text-fuchsia-500 transition-colors duration-300" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-orange-900 group-hover:text-fuchsia-600 transition-colors duration-300">UNIDADE 2: Templo Nambei - Quinta-feira</h3>
              </div>
            </div>

            <div className="space-y-8">
              <button 
                onClick={() => {
                  setUnidade('unidade2');
                  setTurmaPrincipal('Dança de Salão em Geral');
                  document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl hover:bg-orange-50 transition-all duration-200 active:scale-[0.98] group/item"
              >
                <div className="flex items-center gap-3 min-w-[180px]">
                  <Clock className="text-orange-600" size={24} />
                  <span className="text-xl font-bold text-orange-600">18h20 - 19h20</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-orange-900 group-hover/item:text-orange-600 transition-colors">Dança de Salão em Geral</h4>
                  <p className="text-orange-700">Vanera, Chamamé, Bolero, etc.</p>
                </div>
                <ArrowRight className="text-orange-300 group-hover/item:text-orange-600 transition-all group-hover/item:translate-x-2" size={24} />
              </button>

              <button 
                onClick={() => {
                  setUnidade('unidade2');
                  setTurmaPrincipal('Forró');
                  document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl hover:bg-orange-50 transition-all duration-200 active:scale-[0.98] group/item"
              >
                <div className="flex items-center gap-3 min-w-[180px]">
                  <Clock className="text-orange-600" size={24} />
                  <span className="text-xl font-bold text-orange-600">19h30 - 20h30</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-orange-900 group-hover/item:text-orange-600 transition-colors">Forró</h4>
                  <p className="text-orange-700">Do zero</p>
                </div>
                <ArrowRight className="text-orange-300 group-hover/item:text-orange-600 transition-all group-hover/item:translate-x-2" size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Valores Section */}
      <motion.section 
        id="investimento"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-6 bg-[#120400] text-orange-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-50 mb-6">Investimento</h2>
            <p className="text-lg text-orange-200 max-w-2xl mx-auto mb-8">
              Escolha a melhor opção para você. A matrícula já está inclusa no valor de todas as mensalidades.
            </p>

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 bg-orange-900/50 border border-orange-800 px-6 py-3 rounded-full text-orange-200 text-sm font-medium">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
                Passo 2: Clique em um dos planos abaixo para avançar
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Público Geral */}
            <div className="bg-orange-900/50 rounded-[32px] p-8 border border-orange-800 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold text-orange-50 mb-6 text-center">Público Geral</h3>
                
                <div className="space-y-5">
                  <button 
                    onClick={() => {
                      setIsUniversitario(false);
                      setTipoInscricao('individual');
                      document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex justify-between items-center border-b border-orange-800 pb-3 hover:bg-orange-800/30 transition-colors p-2 rounded-lg group/price"
                  >
                    <div className="flex items-center gap-3">
                      <User className="text-orange-500" size={24} strokeWidth={1.5} />
                      <span className="text-lg text-orange-200 group-hover/price:text-orange-50 transition-colors">Individual</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-2xl font-bold text-orange-50">R$ 120</span>
                        <span className="text-orange-400 text-xs">/mês</span>
                      </div>
                      <ArrowRight className="text-orange-500 opacity-0 group-hover/price:opacity-100 transition-all group-hover/price:translate-x-1" size={20} />
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setIsUniversitario(false);
                      setTipoInscricao('dupla');
                      document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex justify-between items-center pb-1 hover:bg-orange-800/30 transition-colors p-2 rounded-lg group/price"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="text-orange-500" size={24} strokeWidth={1.5} />
                      <span className="text-lg text-orange-200 group-hover/price:text-orange-50 transition-colors">Em Dupla</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-2xl font-bold text-orange-50">R$ 180</span>
                        <span className="text-orange-400 text-xs">/mês</span>
                      </div>
                      <ArrowRight className="text-orange-500 opacity-0 group-hover/price:opacity-100 transition-all group-hover/price:translate-x-1" size={20} />
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-orange-800/30 rounded-xl p-3 flex items-center gap-3 border border-orange-800">
                <CheckCircle className="text-orange-500 shrink-0" size={18} />
                <Tooltip content="Não cobramos taxa de matrícula separada. O valor é único e mensal.">
                  <span className="text-orange-300 text-xs border-b border-dashed border-orange-600 cursor-help">Matrícula inclusa no valor da mensalidade.</span>
                </Tooltip>
              </div>
            </div>

            {/* Universitários */}
            <div className="bg-orange-900/50 rounded-[32px] p-8 border border-orange-800 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl tracking-widest uppercase">
                Especial
              </div>
              
              <div>
                <h3 className="text-2xl font-display font-bold text-orange-50 mb-6 text-center">Universitários</h3>
                
                <div className="space-y-5">
                  <button 
                    onClick={() => {
                      setIsUniversitario(true);
                      setTipoInscricao('individual');
                      document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex justify-between items-center border-b border-orange-800 pb-3 hover:bg-orange-800/30 transition-colors p-2 rounded-lg group/price"
                  >
                    <div className="flex items-center gap-3">
                      <User className="text-orange-500" size={24} strokeWidth={1.5} />
                      <span className="text-lg text-orange-200 group-hover/price:text-orange-50 transition-colors">Individual</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-2xl font-bold text-orange-50">R$ 100</span>
                        <span className="text-orange-400 text-xs">/mês</span>
                      </div>
                      <ArrowRight className="text-orange-500 opacity-0 group-hover/price:opacity-100 transition-all group-hover/price:translate-x-1" size={20} />
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      setIsUniversitario(true);
                      setTipoInscricao('dupla');
                      document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex justify-between items-center pb-1 hover:bg-orange-800/30 transition-colors p-2 rounded-lg group/price"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="text-orange-500" size={24} strokeWidth={1.5} />
                      <span className="text-lg text-orange-200 group-hover/price:text-orange-50 transition-colors">Em Dupla*</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-2xl font-bold text-orange-50">R$ 150</span>
                        <span className="text-orange-400 text-xs">/mês</span>
                      </div>
                      <ArrowRight className="text-orange-500 opacity-0 group-hover/price:opacity-100 transition-all group-hover/price:translate-x-1" size={20} />
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-orange-800/30 rounded-xl p-3 flex items-start gap-3 border border-orange-800">
                <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <Tooltip content="É necessário apresentar comprovante de matrícula atualizado de ambos os alunos.">
                  <span className="text-orange-300 text-xs border-b border-dashed border-orange-600 cursor-help">*O valor promocional em dupla só é válido se <strong className="text-orange-100">ambos</strong> forem universitários.</span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-6 text-center shadow-lg border border-orange-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-tr-full pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
              <span className="text-4xl">✨</span>
              <div className="text-left">
                <h4 className="text-xl font-display font-bold text-white mb-1">Promoção Especial</h4>
                <p className="text-orange-50 font-medium text-lg">
                  Na compra de uma turma, a <strong className="text-white">segunda turma sai pela metade do preço!</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Formulário de Matrícula */}
      <motion.section 
        id="matricula"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-16 px-6 bg-orange-50"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-orange-900/5 border border-orange-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-orange-900 mb-2">Faça sua Matrícula</h2>
              <div className="inline-block mt-4 bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                Passo Final
              </div>
              <p className="text-orange-700 mt-4 text-sm max-w-lg mx-auto">
                Preencha seus dados abaixo. As opções selecionadas nos passos anteriores já foram preenchidas para você!
              </p>
            </div>

            <form onSubmit={handleWhatsAppRedirect} className="space-y-6">
              {/* Unidade */}
              <div className="space-y-3">
                <label className="block text-xs font-bold tracking-wide uppercase text-orange-800">Unidade</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUnidade('unidade1');
                      setSegundaTurma('');
                    }}
                    className={`py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      unidade === 'unidade1' 
                        ? 'border-orange-800 text-orange-900 bg-orange-50' 
                        : 'border-orange-200 text-orange-400 hover:border-orange-300'
                    }`}
                  >
                    <MapPin size={24} strokeWidth={1.5} />
                    <span className="font-bold text-base text-center">Teatro do Mundo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnidade('unidade2');
                      setSegundaTurma('');
                      setQuerSegundaTurma(false);
                    }}
                    className={`py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      unidade === 'unidade2' 
                        ? 'border-orange-800 text-orange-900 bg-orange-50' 
                        : 'border-orange-200 text-orange-400 hover:border-orange-300'
                    }`}
                  >
                    <MapPin size={24} strokeWidth={1.5} />
                    <span className="font-bold text-base text-center">Templo</span>
                  </button>
                </div>
              </div>

              {/* Turma Principal */}
              <div className="space-y-3">
                <label htmlFor="turmaPrincipal" className="block text-xs font-bold tracking-wide uppercase text-orange-800">Turma</label>
                {unidade === 'unidade1' ? (
                  <select 
                    id="turmaPrincipal" 
                    required
                    value={turmaPrincipal}
                    onChange={(e) => setTurmaPrincipal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-orange-50/50 text-sm text-orange-900"
                  >
                    <option value="" disabled>Selecione a turma principal...</option>
                    <option value="Vanera e Chamamé">Vanera e Chamamé</option>
                    <option value="Forró">Forró</option>
                  </select>
                ) : (
                  <select 
                    id="turmaPrincipal" 
                    required
                    value={turmaPrincipal}
                    onChange={(e) => setTurmaPrincipal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-orange-50/50 text-sm text-orange-900"
                  >
                    <option value="" disabled>Selecione a turma principal...</option>
                    <option value="Dança de Salão em Geral">Dança de Salão em Geral</option>
                    <option value="Forró">Forró</option>
                  </select>
                )}
              </div>

              {/* Tipo de Inscrição */}
              <div className="space-y-3">
                <label className="block text-xs font-bold tracking-wide uppercase text-orange-800">Modalidade</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoInscricao('individual')}
                    className={`py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      tipoInscricao === 'individual' 
                        ? 'border-orange-800 text-orange-900 bg-orange-50' 
                        : 'border-orange-200 text-orange-400 hover:border-orange-300'
                    }`}
                  >
                    <User size={24} strokeWidth={1.5} />
                    <span className="font-bold text-base">Individual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoInscricao('dupla')}
                    className={`py-4 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      tipoInscricao === 'dupla' 
                        ? 'border-orange-600 text-orange-600 bg-orange-50' 
                        : 'border-orange-200 text-orange-400 hover:border-orange-300'
                    }`}
                  >
                    <Users size={24} strokeWidth={1.5} />
                    <span className="font-bold text-base">Em Dupla</span>
                  </button>
                </div>
              </div>

              {/* Universitário Toggle */}
              <div 
                className={`p-4 rounded-xl transition-colors cursor-pointer border-2 ${
                  isUniversitario ? 'bg-orange-100/50 border-orange-200' : 'bg-orange-50 border-transparent'
                }`}
                onClick={() => setIsUniversitario(!isUniversitario)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                    isUniversitario ? 'bg-orange-600 text-white' : 'bg-white border-2 border-orange-300'
                  }`}>
                    {isUniversitario && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-900 text-base mb-1">Sou Universitário</h3>
                    {tipoInscricao === 'dupla' && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-orange-600 text-xs leading-relaxed mt-1"
                      >
                        Atenção: Para o desconto em dupla, ambos os alunos devem ser universitários.
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              {/* Segunda Turma Toggle */}
              <div className="space-y-3">
                <div 
                  className={`p-4 rounded-xl transition-colors cursor-pointer border-2 ${
                    querSegundaTurma ? 'bg-orange-600/10 border-orange-400' : 'bg-orange-50 border-transparent'
                  }`}
                  onClick={() => setQuerSegundaTurma(!querSegundaTurma)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                      querSegundaTurma ? 'bg-orange-600 text-white' : 'bg-white border-2 border-orange-300'
                    }`}>
                      {querSegundaTurma && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 text-base mb-1">Adicionar mais turmas</h3>
                      <p className="text-orange-600 text-xs leading-relaxed mt-1">
                        Informação complementar: a partir da segunda turma, o valor sai com 50% de desconto!
                      </p>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {querSegundaTurma && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label htmlFor="segundaTurma" className="block text-xs font-bold tracking-wide uppercase text-orange-800 mb-2 mt-2">Qual será a turma adicional?</label>
                      {unidade === 'unidade1' ? (
                        <select 
                          id="segundaTurma" 
                          required={querSegundaTurma}
                          value={segundaTurma}
                          onChange={(e) => setSegundaTurma(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-orange-50/50 text-sm text-orange-900"
                        >
                          <option value="" disabled>Selecione uma turma...</option>
                          {['Vanera e Chamamé', 'Forró'].filter(t => t !== turmaPrincipal).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      ) : (
                        <select 
                          id="segundaTurma" 
                          required={querSegundaTurma}
                          value={segundaTurma}
                          onChange={(e) => setSegundaTurma(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-orange-50/50 text-sm text-orange-900"
                        >
                          <option value="" disabled>Selecione uma turma...</option>
                          {['Dança de Salão em Geral', 'Forró'].filter(t => t !== turmaPrincipal).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4 pt-4 border-t border-orange-100">
                {tipoInscricao === 'individual' ? (
                  <div>
                    <label htmlFor="nome" className="block text-xs font-bold tracking-wide uppercase text-orange-800 mb-2">Nome</label>
                    <input 
                      type="text" 
                      id="nome" 
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-orange-50/50 text-sm"
                      placeholder="Como você gostaria de ser chamado?"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="nomeDupla" className="block text-xs font-bold tracking-wide uppercase text-orange-800 mb-2">Nome da dupla</label>
                    <input 
                      type="text" 
                      id="nomeDupla" 
                      required
                      value={nomeDupla}
                      onChange={(e) => setNomeDupla(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-orange-50/50 text-sm"
                      placeholder="Nomes das duas pessoas"
                    />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-orange-900 flex items-center justify-between">
                <span className="text-orange-600 text-base">Valor da Mensalidade:</span>
                <motion.span 
                  key={calcularValor()}
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="text-3xl font-display font-bold text-orange-900"
                >
                  R$ {calcularValor()}
                </motion.span>
              </div>

              <div className="space-y-3">
                <button 
                  type="submit"
                  disabled={!turmaPrincipal}
                  className="w-full bg-[#25D366] text-white py-4 rounded-full font-bold tracking-wide text-base hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                  <span>Confirmar pelo WhatsApp</span>
                </button>
                <p className="text-center text-orange-500 text-xs">
                  Você será redirecionado para o nosso WhatsApp para finalizar a matrícula.
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative bg-[#120400] pt-32 pb-20 md:pt-48 md:pb-20 px-6 mt-auto">
        <WaveDivider position="top" colorClass="fill-orange-50" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="font-display font-bold text-4xl text-orange-200">ESTAÇÕES</div>
            <p className="text-orange-200 max-w-md text-lg leading-relaxed">
              Nossa proposta é mostrar que todo mundo pode dançar. Venha desenvolver sua consciência corporal, musicalidade e o prazer em dançar em um ambiente acolhedor.
            </p>
            <div className="flex gap-4">
              <a href="https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-orange-800 flex items-center justify-center text-orange-100 hover:bg-orange-600 hover:text-white transition-colors animate-pulse hover:animate-none shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-2xl text-orange-200 mb-6">Links Rápidos</h4>
            <ul className="space-y-4 text-orange-200 text-lg">
              <li><Link href="/#sobre" className="hover:text-orange-400 transition-colors">Sobre Nós</Link></li>
              <li><Link href="/aulas-regulares" className="hover:text-orange-400 transition-colors">Nossas Aulas</Link></li>
              <li><Link href="/#trabalhos" className="hover:text-orange-400 transition-colors">Trabalhos</Link></li>
              <li><Link href="/#unidades" className="hover:text-orange-400 transition-colors">Unidades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-2xl text-orange-200 mb-6">Contato</h4>
            <ul className="space-y-4 text-orange-200 text-lg">
              <li>
                <a href="mailto:cursodeverao67@gmail.com" className="hover:text-orange-400 transition-colors">
                  cursodeverao67@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/5567992630948" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  (67) 99263-0948
                </a>
              </li>
              <li>Seg - Sex: 08h às 22h</li>
              <li>Sáb: 09h às 14h</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-orange-800 flex flex-col md:flex-row items-center justify-between gap-4 text-orange-400">
          <p>&copy; {new Date().getFullYear()} Escola de Dança Estações. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade" className="hover:text-orange-300 transition-colors underline underline-offset-2">
            Política de Privacidade
          </Link>
        </div>
      </footer>
      <BackToTop />
    </main>
  );
}
