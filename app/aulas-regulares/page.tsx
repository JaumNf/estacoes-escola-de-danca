'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import Tooltip from '@/components/Tooltip';
import { Calendar, MapPin, Clock, ArrowRight, Check, CheckCircle, Instagram, Facebook, User, Users, AlertCircle, Navigation } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import BackToTop from '@/components/BackToTop';
import dynamic from 'next/dynamic';
import AulaExperimentalModal from './AulaExperimentalModal';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-orange-100/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-orange-400 font-bold">Carregando mapa...</span>
    </div>
  )
});

export default function AulasRegulares() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unidade, setUnidade] = useState<'unidade1' | 'unidade2'>('unidade1');
  const [turmaPrincipal, setTurmaPrincipal] = useState('');
  const [tipoInscricao, setTipoInscricao] = useState<'individual' | 'dupla'>('individual');
  const [isUniversitario, setIsUniversitario] = useState(false);
  const [querSegundaTurma, setQuerSegundaTurma] = useState(false);
  const [segundaTurma, setSegundaTurma] = useState('');
  const [nome, setNome] = useState('');
  const [nomeDupla, setNomeDupla] = useState('');
  
  const [touched, setTouched] = useState({
    nome: false,
    nomeDupla: false,
    turmaPrincipal: false,
    segundaTurma: false,
  });

  const errors = (() => {
    let errs: any = {};
    if (!turmaPrincipal) errs.turmaPrincipal = 'Selecione uma turma principal.';
    if (querSegundaTurma && !segundaTurma) errs.segundaTurma = 'Selecione a turma adicional.';
    if (tipoInscricao === 'individual' && !nome.trim()) errs.nome = 'Preencha o seu nome.';
    if (tipoInscricao === 'dupla' && !nomeDupla.trim()) errs.nomeDupla = 'Preencha o nome da dupla.';
    return errs;
  })();

  const isValid = Object.keys(errors).length === 0;

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
    
    setTouched({
      nome: true,
      nomeDupla: true,
      turmaPrincipal: true,
      segundaTurma: true,
    });

    if (!isValid) return;
    
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-orange-700 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-orange-100 transition-colors duration-300 shadow-lg inline-flex items-center gap-2 cursor-pointer"
            >
              Agendar aula experimental
            </button>
            <button 
              onClick={() => document.getElementById('horarios')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-600 text-orange-50 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-orange-800 transition-colors duration-300 shadow-lg inline-flex items-center gap-2"
            >
              Quero Começar <ArrowRight size={20} />
            </button>
          </div>
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
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
            className="text-4xl md:text-5xl font-display font-bold text-orange-900"
          >
            Nossa Filosofia
          </motion.h2>
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
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Encontre a turma perfeita para a sua rotina.
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

              <button 
                onClick={() => {
                  setUnidade('unidade1');
                  setTurmaPrincipal('Bachata');
                  document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl hover:bg-orange-50 transition-all duration-200 active:scale-[0.98] group/item"
              >
                <div className="flex items-center gap-3 min-w-[180px]">
                  <Clock className="text-orange-600" size={24} />
                  <span className="text-xl font-bold text-orange-600">20h40 - 21h40</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-orange-900 group-hover/item:text-orange-600 transition-colors">Bachata</h4>
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
            <p className="text-lg text-orange-200 max-w-2xl mx-auto">
              Escolha a melhor opção para você. A matrícula já está inclusa no valor de todas as mensalidades.
            </p>
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
                <Tooltip content="É necessário apresentar comprovante de matrícula atualizado de ambos os alunos. Caso apenas um seja universitário, a inscrição deverá ser feita via Inscrição Individual para cada um.">
                  <span className="text-orange-300 text-xs border-b border-dashed border-orange-600 cursor-help">*O valor promocional em dupla só é válido se <strong className="text-orange-100">ambos</strong> forem universitários. Se apenas um for universitário, deverão realizar inscrições individuais (um com desconto, outro sem).</span>
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
          <div className="bg-white p-6 md:p-12 rounded-[32px] shadow-xl shadow-orange-900/5 border border-orange-100 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-orange-900 mb-6">
              Garanta sua vaga!
            </h2>
            
            <p className="text-orange-700 text-lg max-w-lg mx-auto mb-10">
              Agende sua aula experimental agora! Escolha a modalidade de matrícula que mais faz sentido para você e venha dançar com a gente!
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="https://docs.google.com/forms/d/1dFNLj91v5MmDWxBsLkG0ahtzBCAXL5zJPwp7juv99nw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-8 border-2 border-orange-200 rounded-2xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <span className="font-bold text-orange-900 text-xl">Matrícula Individual</span>
              </a>
              <a 
                href="https://docs.google.com/forms/d/1OXWr0dlm5laEC8D8NzOUOHQopgTedmGbhrOeiSEqo4o"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-8 border-2 border-orange-200 rounded-2xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users size={32} />
                </div>
                <span className="font-bold text-orange-900 text-xl">Matrícula em Dupla</span>
              </a>
            </div>
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
                <a href="mailto:gustavoissao2005@gmail.com" className="hover:text-orange-400 transition-colors">
                  gustavoissao2005@gmail.com
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
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/dancaestacoes/" target="_blank" rel="noopener noreferrer" className="text-orange-200 hover:text-orange-400 transition-colors">
                <Instagram size={28} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-orange-200 hover:text-orange-400 transition-colors">
                <Facebook size={28} />
              </a>
            </div>
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
      
      <AulaExperimentalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
