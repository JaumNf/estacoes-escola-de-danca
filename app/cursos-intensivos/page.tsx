'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import Tooltip from '@/components/Tooltip';
import { Calendar, MapPin, Clock, ArrowRight, Check, CheckCircle, Instagram, Facebook, User, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

export default function CursosIntensivos() {
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
      valorBase = tipoInscricao === 'individual' ? 120 : 200;
    } else {
      valorBase = tipoInscricao === 'individual' ? 150 : 250;
    }

    if (querSegundaTurma) {
      // Segunda turma sai pela metade do preço da modalidade escolhida
      valorBase += valorBase / 2;
    }

    return valorBase;
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    
    let mensagem = `Olá! Gostaria de me matricular nos cursos intensivos.%0A%0A`;
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
            src="https://picsum.photos/seed/dance3/1920/1080"
            alt="Cursos Intensivos"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120400]/80 via-black/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-lg">Cursos Intensivos</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-10 drop-shadow-md">
            Mergulhe fundo na dança com nossos cursos de curta duração e aprendizado acelerado.
          </p>
          <button 
            onClick={() => document.getElementById('matricula')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-orange-600 text-orange-50 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-orange-800 transition-colors duration-300 shadow-lg inline-flex items-center gap-2"
          >
            Quero Participar <ArrowRight size={20} />
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
          <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-900">Aprendizado Acelerado</h2>
          <div className="w-24 h-1.5 bg-orange-600 mx-auto rounded-full"></div>
          <p className="text-lg md:text-xl text-orange-800 leading-relaxed">
            Nossos cursos intensivos são projetados para quem quer aprender rápido ou aprimorar técnicas específicas em pouco tempo. Focamos na imersão total, com aulas dinâmicas que cobrem desde os fundamentos até movimentos complexos em um curto período.
          </p>
        </div>
      </motion.section>

      {/* Horários Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-6 bg-orange-100/30"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-900 mb-6">Próximas Turmas</h2>
            <p className="text-lg text-orange-700">Confira nossa agenda de cursos intensivos.</p>
          </div>

          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-orange-900/5 border border-orange-100">
            <div className="flex items-center gap-4 mb-8 border-b border-orange-100 pb-6">
              <div className="w-12 h-12 rounded-full border-2 border-orange-600 flex items-center justify-center shrink-0">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-orange-900">Intensivo de Férias</h3>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex items-center gap-3 min-w-[180px]">
                  <Clock className="text-orange-600" size={24} />
                  <span className="text-xl font-bold text-orange-600">Sábados - 14h às 17h</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-orange-900">Forró e Samba</h4>
                  <p className="text-orange-700">Imersão de 4 semanas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Valores Section */}
      <motion.section 
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
              Valores para o curso completo (módulo único).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Público Geral */}
            <div className="bg-orange-900/50 rounded-[32px] p-8 border border-orange-800 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold text-orange-50 mb-6 text-center">Público Geral</h3>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-orange-800 pb-3">
                    <div className="flex items-center gap-3">
                      <User className="text-orange-500" size={24} strokeWidth={1.5} />
                      <span className="text-lg text-orange-200">Individual</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-50">R$ 150</span>
                      <span className="text-orange-400 text-xs">/curso</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <div className="flex items-center gap-3">
                      <Users className="text-orange-500" size={24} strokeWidth={1.5} />
                      <span className="text-lg text-orange-200">Em Dupla</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-50">R$ 250</span>
                      <span className="text-orange-400 text-xs">/curso</span>
                    </div>
                  </div>
                </div>
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
                  <div className="flex justify-between items-center border-b border-orange-800 pb-3">
                    <div className="flex items-center gap-3">
                      <User className="text-orange-500" size={24} strokeWidth={1.5} />
                      <Tooltip content="Obrigatório apresentar comprovante de matrícula atualizado. A segunda turma sai por 50% do valor desta modalidade.">
                        <span className="text-lg text-orange-200 border-b border-dashed border-orange-600 cursor-help">Individual</span>
                      </Tooltip>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-50">R$ 120</span>
                      <span className="text-orange-400 text-xs">/curso</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <div className="flex items-center gap-3">
                      <Users className="text-orange-500" size={24} strokeWidth={1.5} />
                      <Tooltip content="Válido apenas se ambos forem universitários. A segunda turma sai por 50% do valor desta modalidade.">
                        <span className="text-lg text-orange-200 border-b border-dashed border-orange-600 cursor-help">Em Dupla*</span>
                      </Tooltip>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-50">R$ 200</span>
                      <span className="text-orange-400 text-xs">/curso</span>
                    </div>
                  </div>
                </div>
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
              <h2 className="text-2xl md:text-3xl font-display font-bold text-orange-900 mb-2">Garanta sua Vaga</h2>
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
                  <div className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50/50 text-sm text-orange-600 italic">
                    Nenhuma turma disponível nesta unidade no momento.
                  </div>
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
                        <div className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50/50 text-sm text-orange-600 italic">
                          Nenhuma turma adicional disponível nesta unidade no momento.
                        </div>
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
                <span className="text-orange-600 text-base">Valor do Curso:</span>
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
                  disabled={unidade === 'unidade2' || (unidade === 'unidade1' && !turmaPrincipal)}
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
    </main>
  );
}
