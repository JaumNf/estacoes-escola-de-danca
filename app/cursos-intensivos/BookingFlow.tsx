'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Users, Check, ArrowRight, ArrowLeft, Info, Copy, Upload, X, AlertCircle, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Ritmo {
  id: string;
  nome: string;
  nivel: string;
  dia: string;
  hora: string;
}

interface BookingFlowProps {
  ritmos: Ritmo[];
}

export default function BookingFlow({ ritmos }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('success=true')) {
      setSubmitted(true);
    }
  }, []);
  
  const [tipoInscricao, setTipoInscricao] = useState<'individual' | 'dupla'>('individual');
  const [cursosSelecionados, setCursosSelecionados] = useState<string[]>([]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [comoConheceu, setComoConheceu] = useState('');
  const [promoter, setPromoter] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [autorizacao, setAutorizacao] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPrices, setShowPrices] = useState(false);

  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    whatsapp: false,
    comoConheceu: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCurso = (id: string) => {
    setCursosSelecionados(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const { finalValue, selectedDaysCount } = useMemo(() => {
    if (cursosSelecionados.length === 0) return { finalValue: 0, selectedDaysCount: 0 };
    
    const selectedCursos = ritmos.filter(r => cursosSelecionados.includes(r.id));
    const days = new Set(selectedCursos.map(r => r.dia));
    const classesByDay = {
      '22 de Maio': selectedCursos.filter(r => r.dia === '22 de Maio').length,
      '23 de Maio': selectedCursos.filter(r => r.dia === '23 de Maio').length,
    };

    let fVal = 0;
    
    if (tipoInscricao === 'individual') {
      let day1Cost = Math.min(45, classesByDay['22 de Maio'] * 20);
      let day2Cost = Math.min(45, classesByDay['23 de Maio'] * 20);
      fVal = Math.min(80, day1Cost + day2Cost);
    } else {
      // Dupla - pacote por dia
      fVal = days.size === 1 ? 80 : 120;
    }

    return {
      finalValue: fVal,
      selectedDaysCount: days.size,
    };
  }, [cursosSelecionados, tipoInscricao, ritmos]);

  // Validations
  const errors = useMemo(() => {
    const errs: any = {};
    if (!nome.trim()) errs.nome = 'Nome é obrigatório.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'E-mail inválido.';
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) errs.whatsapp = 'WhatsApp inválido.';
    if (!comoConheceu) errs.comoConheceu = 'Selecione uma opção.';
    if (comoConheceu === 'Indicação' && !promoter) errs.promoter = 'Selecione um promoter.';
    if (!arquivo) errs.arquivo = 'Anexe o comprovante.';
    if (!autorizacao) errs.autorizacao = 'Aceite os termos obrigatórios.';
    return errs;
  }, [nome, email, whatsapp, comoConheceu, promoter, arquivo, autorizacao]);

  const isValid = Object.keys(errors).length === 0;

  const handleCopyPix = () => {
    navigator.clipboard.writeText('cursodeverao67@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (validTypes.includes(file.type)) {
        setArquivo(file);
      } else {
        alert('Formato inválido. Envie PDF, PNG ou JPEG.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({
      nome: true,
      email: true,
      whatsapp: true,
      comoConheceu: true,
    });
    
    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios e anexe o comprovante de pagamento.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const response = await fetch("https://formsubmit.co/ajax/cursodeverao67@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsSubmitting(false);
        alert("Ocorreu um erro ao enviar. Por favor, tente novamente ou nos chame no WhatsApp.");
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert("Erro de conexão. Por favor, tente novamente.");
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-[#fffdf0] rounded-3xl shadow-2xl max-w-lg w-full relative"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Check size={48} className="stroke-[3]" />
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-4">Inscrição Confirmada!</h3>
          <p className="text-[#a04e22] text-lg mb-8 leading-relaxed">
            Recebemos seus dados e o comprovante. Sua vaga está garantida!
          </p>
          <a 
            href="https://chat.whatsapp.com/JAC5pq1CG141OZaziUXoM7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1ebd5c] text-white font-bold py-4 w-full rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 mb-4"
          >
            Entrar no grupo do WhatsApp
          </a>
          <Link href="/" className="text-[#a04e22] underline font-medium hover:text-[#ea5d35]">
            Voltar para a página inicial
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 relative px-4 md:px-0">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 text-[#a04e22] font-semibold hover:text-[#682c0b] transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Voltar para o início
      </Link>
      
      {/* Container Principal */}
      <div className="bg-white rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 md:p-10"
            >
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fffcf5] text-[#d97706] text-sm font-bold tracking-widest uppercase border border-[#fcd34d] mb-4">
                  ✨ LOTE PROMOCIONAL - GRUPO
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-[#3d1c04] mb-3">Garanta seu lugar</h2>
                <p className="text-[#8c7438]">Escolha as turmas e aproveite os descontos progressivos</p>
              </div>

              {/* Como se inscrever box */}
              <div className="bg-[#fffdf0] rounded-3xl border border-[#fae8d4] p-6 md:p-8 mb-10 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 border-[20px] border-[#fae8d4]/30 rounded-full opacity-50 pointer-events-none" />
                <h3 className="text-sm font-bold text-[#a04e22] tracking-widest uppercase mb-6 flex items-center gap-2">
                  <span className="text-[#ea5d35] material-symbols-rounded">help</span> COMO SE INSCREVER (PASSO A PASSO):
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#ea5d35] text-[#ea5d35] font-bold flex items-center justify-center shrink-0">1</div>
                    <p className="text-[#645c58] text-sm pt-1">Defina se a inscrição é <strong>Individual</strong> ou <strong>Em Dupla</strong> e selecione as aulas no calendário.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#ea5d35] text-[#ea5d35] font-bold flex items-center justify-center shrink-0">2</div>
                    <p className="text-[#645c58] text-sm pt-1">Clique no botão <strong>&quot;Prosseguir para Pagamento&quot;</strong> no final da página.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#ea5d35] text-[#ea5d35] font-bold flex items-center justify-center shrink-0">3</div>
                    <p className="text-[#645c58] text-sm pt-1">Preencha seus dados pessoais, faça o pagamento via PIX e anexe o comprovante.</p>
                  </div>
                  <div className="flex gap-4 bg-red-50 p-4 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-red-400 text-white font-bold flex items-center justify-center shrink-0 border-2 border-red-400">4</div>
                    <p className="text-red-800 text-sm font-medium pt-1">
                      Importante: Você DEVE clicar em <strong>&quot;ENVIAR COMPROVANTE&quot;</strong> para finalizar!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-xl font-bold text-[#682c0b] flex items-center gap-2">
                    Defina o tipo de inscrição
                  </h3>
                  <button 
                    onClick={() => setShowPrices(!showPrices)}
                    className="text-sm font-bold text-[#ea5d35] hover:text-[#c44e2b] transition-colors flex items-center gap-1 bg-[#fae8d4]/50 px-3 py-1.5 rounded-full"
                  >
                    <Info size={16} />
                    {showPrices ? "Ocultar valores" : "Ver valores"}
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                  <button 
                    onClick={() => setTipoInscricao('individual')}
                    className={`flex-1 min-h-[44px] p-5 rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 text-left ${tipoInscricao === 'individual' ? 'bg-[#fae8d4] text-[#682c0b] border-2 border-[#d69f65] shadow-md scale-[1.02]' : 'bg-[#fffcf5] text-gray-500 border border-gray-200 hover:bg-orange-50'}`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <User size={24} className={tipoInscricao === 'individual' ? "text-[#ea5d35]" : "text-gray-400"} />
                      <div className="font-bold text-lg">Individual</div>
                    </div>
                    {showPrices && (
                      <ul className="text-sm font-medium text-[#645c58] space-y-1.5 mt-2 bg-white/50 w-full p-4 rounded-xl border border-orange-900/5">
                        <li className="flex justify-between"><span>Aula avulsa</span> <strong>R$ 20</strong></li>
                        <li className="flex justify-between"><span>Pacote 1 dia</span> <strong>R$ 45</strong></li>
                        <li className="flex justify-between"><span>Pacote 2 dias <span className="text-[#ea5d35] text-[10px] uppercase ml-1">C/ Baile</span></span> <strong>R$ 80</strong></li>
                      </ul>
                    )}
                  </button>
                  <button 
                    onClick={() => setTipoInscricao('dupla')}
                    className={`flex-1 min-h-[44px] p-5 rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 text-left ${tipoInscricao === 'dupla' ? 'bg-[#fae8d4] text-[#682c0b] border-2 border-[#d69f65] shadow-md scale-[1.02]' : 'bg-[#fffcf5] text-gray-500 border border-gray-200 hover:bg-orange-50'}`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Users size={24} className={tipoInscricao === 'dupla' ? "text-[#ea5d35]" : "text-gray-400"} />
                      <div className="font-bold text-lg">Em Dupla</div>
                    </div>
                    {showPrices && (
                      <ul className="text-sm font-medium text-[#645c58] space-y-1.5 mt-2 bg-white/50 w-full p-4 rounded-xl border border-orange-900/5">
                        <li className="flex justify-between text-gray-400 line-through"><span>Aula avulsa</span> <strong>N/A</strong></li>
                        <li className="flex justify-between"><span>Pacote 1 dia</span> <strong>R$ 80</strong></li>
                        <li className="flex justify-between"><span>Pacote 2 dias <span className="text-[#ea5d35] text-[10px] uppercase ml-1">C/ Baile</span></span> <strong>R$ 120</strong></li>
                      </ul>
                    )}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#682c0b] mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ea5d35] text-white flex items-center justify-center text-sm">1</div>
                Quais aulas você quer participar?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                {ritmos.map((ritmo) => {
                  const isSelected = cursosSelecionados.includes(ritmo.id);
                  return (
                    <button
                      key={ritmo.id}
                      onClick={() => toggleCurso(ritmo.id)}
                      className={`relative p-5 rounded-2xl text-left border-2 transition-all duration-300 ${
                        isSelected 
                        ? 'border-[#ea5d35] bg-[#fff5f2] shadow-md -translate-y-1' 
                        : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#ea5d35] bg-white' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-[#ea5d35]" />}
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-[11px] font-bold text-[#ea5d35] uppercase tracking-widest mb-1">{ritmo.dia.toUpperCase()}</p>
                        <h4 className={`text-xl font-display font-bold leading-tight mb-1 pr-8 ${isSelected ? 'text-[#682c0b]' : 'text-gray-800'}`}>{ritmo.nome}</h4>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase">{ritmo.nivel}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-4">{ritmo.hora}</p>
                    </button>
                  );
                })}
              </div>

              {/* Tabela de Valores Abaixo da grade */}
              <div className="bg-orange-50/50 border-t border-orange-100 p-6 md:p-8 mt-12 flex flex-col md:flex-row items-center justify-between relative gap-6 transition-all rounded-b-[40px] -mx-6 md:-mx-10 -mb-6 md:-mb-10">
                <div className="relative z-10 flex-1 w-full flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-1">
                    <div className="flex flex-col">
                      <p className="text-orange-600 text-xs md:text-sm font-bold uppercase tracking-wide">
                        {cursosSelecionados.length} turma{cursosSelecionados.length !== 1 ? 's' : ''} <span className="hidden md:inline">em {selectedDaysCount} dia{selectedDaysCount !== 1 ? 's' : ''}</span>
                      </p>
                      <h3 className="text-3xl md:text-5xl font-display font-bold text-[#682c0b] leading-none mb-1">
                        <span className="md:hidden text-lg font-normal">Total: </span>R$ {finalValue.toFixed(2).replace('.', ',')}
                      </h3>
                      {selectedDaysCount === 2 && (
                         <p className="text-green-600 text-[10px] md:text-sm font-bold mt-1 hidden md:block">✨ Bônus: Baile de Encerramento Incluso!</p>
                      )}
                    </div>
                </div>

                <div className="relative z-10 w-full md:w-auto mt-2 md:mt-0">
                   <button 
                      disabled={cursosSelecionados.length === 0}
                      onClick={() => setStep(2)}
                      className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold tracking-wide flex items-center justify-center gap-2 transition-all shrink-0 w-full md:w-auto h-fit min-h-[44px] ${
                        cursosSelecionados.length > 0 
                        ? 'bg-[#ea5d35] hover:bg-[#c44e2b] text-white shadow-[0_4px_14px_rgba(234,93,53,0.3)]' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                   >
                      {cursosSelecionados.length > 0 ? 'Prosseguir para Pagamento' : 'Selecione uma aula'} <ArrowRight size={18} className="hidden md:block"/>
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 md:p-10"
            >
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[#a04e22] font-semibold mb-6 md:mb-8 hover:text-[#682c0b] transition-colors group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Voltar para turmas
              </button>

              <div className="bg-[#fffdf0] border border-[#e8c09a] rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                 <div>
                   <p className="text-[#a04e22] text-xs md:text-sm font-bold uppercase tracking-wide mb-1">Resumo do Pedido</p>
                   <h3 className="text-xl md:text-2xl font-display font-bold text-[#682c0b]">
                     {cursosSelecionados.length} turma{cursosSelecionados.length !== 1 && 's'} ({tipoInscricao})
                   </h3>
                 </div>
                 <div className="text-left sm:text-right">
                   <p className="text-2xl md:text-3xl font-display font-bold text-[#ea5d35]">R$ {finalValue.toFixed(2).replace('.', ',')}</p>
                   {selectedDaysCount === 2 && (
                     <p className="text-green-600 text-xs font-bold w-full uppercase mt-1">✨ Baile Incluso</p>
                   )}
                 </div>
              </div>

              <form 
                className="space-y-6 md:space-y-8 bg-white p-4 sm:p-6 md:p-8 rounded-[20px] md:rounded-[32px] shadow-sm border border-gray-100" 
                onSubmit={handleSubmit}
              >
                  {/* Hidden inputs para o FormSubmit */}
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_subject" value={`Nova Inscrição - ${nome || 'Novo Aluno'}`} />
                  <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href.split('?')[0] + '?success=true' : ''} />
                  <input type="hidden" name="Tipo de Inscrição" value={tipoInscricao} />
                  <input type="hidden" name="Turmas Selecionadas" value={cursosSelecionados.map(c => ritmos.find(r => r.id === c)?.nome).join(', ')} />
                  <input type="hidden" name="Dias Selecionados" value={`${selectedDaysCount} dia(s)`} />
                  <input type="hidden" name="Valor Final" value={`R$ ${finalValue.toFixed(2).replace('.', ',')}`} />
                  <input type="hidden" name="Como Conheceu" value={comoConheceu} />
                  {comoConheceu === 'Indicação' && promoter && <input type="hidden" name="Promoter" value={promoter} />}
                  <input type="hidden" name="Autorização de Imagem" value={autorizacao ? 'Sim' : 'Não'} />

                  {/* Dados da inscrição */}
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-[#682c0b] flex items-center gap-2 border-b border-gray-100 pb-3">
                    <User size={20} className="text-[#ea5d35]" /> Dados do Participante
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#645c58] mb-1">Nome Completo</label>
                    <input 
                       type="text" 
                       name="Nome"
                       value={nome}
                       onChange={e => setNome(e.target.value)}
                       onBlur={() => setTouched(p => ({...p, nome: true}))}
                       className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-[#ea5d35]/50 ${touched.nome && errors.nome ? 'border-red-400' : 'border-gray-200 focus:border-[#ea5d35]'}`}
                       placeholder="Seu nome completo"
                     />
                     {touched.nome && errors.nome && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.nome}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#645c58] mb-1">E-mail</label>
                      <input 
                        type="email" 
                        name="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onBlur={() => setTouched(p => ({...p, email: true}))}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-[#ea5d35]/50 ${touched.email && errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#ea5d35]'}`}
                        placeholder="seu@email.com"
                      />
                      {touched.email && errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#645c58] mb-1">WhatsApp</label>
                      <input 
                        type="tel" 
                        name="WhatsApp"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        onBlur={() => setTouched(p => ({...p, whatsapp: true}))}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-[#ea5d35]/50 ${touched.whatsapp && errors.whatsapp ? 'border-red-400' : 'border-gray-200 focus:border-[#ea5d35]'}`}
                        placeholder="(00) 00000-0000"
                      />
                      {touched.whatsapp && errors.whatsapp && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.whatsapp}</p>}
                    </div>
                  </div>
                </div>

                {/* Como conheceu */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-[#645c58] mb-2">Como conheceu os intensivos?</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {['Instagram', 'WhatsApp', 'Indicação', 'Outro'].map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => {
                          setComoConheceu(op);
                          setTouched(p => ({...p, comoConheceu: true}));
                        }}
                        className={`min-h-[44px] py-3 px-2 rounded-xl text-sm font-bold transition-all border ${comoConheceu === op ? 'bg-[#fae8d4] border-[#ea5d35] text-[#682c0b]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                  {touched.comoConheceu && errors.comoConheceu && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.comoConheceu}</p>}

                  {comoConheceu === 'Indicação' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="pt-2">
                       <p className="text-sm font-medium text-gray-500 mb-2">Qual promoter indicou você?</p>
                       <div className="flex gap-2 flex-wrap">
                         {['Manu', 'Ana Laura', 'João', 'Felipe', 'Bia'].map(nm => (
                           <button
                             key={nm}
                             type="button"
                             onClick={() => setPromoter(nm)}
                             className={`min-h-[44px] px-5 py-2 rounded-full text-sm font-bold transition-all border ${promoter === nm ? 'bg-[#682c0b] text-white border-[#682c0b]' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}
                           >
                             {nm}
                           </button>
                         ))}
                       </div>
                       {touched.comoConheceu && errors.promoter && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.promoter}</p>}
                    </motion.div>
                  )}
                </div>

                {/* Pagamento PIX */}
                <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-200 space-y-6">
                  <h3 className="text-lg md:text-xl font-bold text-[#682c0b] flex items-center gap-2 mb-2">
                    <Smartphone size={20} className="text-[#ea5d35]" /> Realize o Pagamento via PIX
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white p-4 rounded-xl md:rounded-2xl border border-gray-100">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                      {/* Fake QR CODE placeholder */}
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-400 pattern-dots" /> 
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <p className="text-sm text-gray-600 text-center md:text-left">Copie a chave PIX (E-mail) abaixo para realizar a transferência de <strong>R$ {finalValue.toFixed(2).replace('.', ',')}</strong>.</p>
                      <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-1 gap-1">
                        <input type="text" readOnly value="cursodeverao67@gmail.com" className="bg-transparent px-3 py-2 flex-1 text-sm font-mono font-medium outline-none text-gray-700 min-w-0 text-center sm:text-left selection:bg-orange-200" />
                        <button type="button" onClick={handleCopyPix} className="px-4 py-3 sm:py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#ea5d35] hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                          {copied ? <Check size={16} /> : <Copy size={16} />} 
                          {copied ? 'Copiada!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-3 text-center">Prefere pagar no Cartão de Crédito? (Acréscimo de taxas)</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href="#" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                        <CreditCard size={16} className="text-[#ea5d35]" /> Crédito à Vista
                      </a>
                      <a href="#" className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                        <CreditCard size={16} className="text-[#ea5d35]" /> Crédito Parcelado
                      </a>
                    </div>
                  </div>
                </div>

                {/* Comprovante Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#682c0b] mb-2 flex items-center gap-2">
                     <Upload size={18} className="text-[#ea5d35]"/> Anexe o comprovante
                  </h3>
                  
                  <div 
                    onClick={() => !arquivo && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${
                      arquivo 
                      ? 'border-green-400 bg-green-50 cursor-default' 
                      : touched.nome && errors.arquivo 
                        ? 'border-red-400 bg-red-50 hover:bg-red-100 cursor-pointer' 
                        : 'border-[#e8c09a] bg-orange-50/50 hover:bg-orange-50 cursor-pointer'
                    }`}
                  >
                    <input 
                      type="file" 
                      name="Comprovante"
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/png, image/jpeg, application/pdf"
                    />
                    
                    {arquivo ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                          <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <p className="font-bold text-green-800 text-sm mb-1">{arquivo.name}</p>
                        <button 
                          type="button" 
                          onClick={(e) => {
                             e.stopPropagation();
                             setArquivo(null);
                          }} 
                          className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 mt-2"
                        >
                          <X size={12}/> Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white border border-[#e8c09a] rounded-full flex items-center justify-center mb-3 shadow-sm text-[#b58b1a]">
                          <Upload size={20} />
                        </div>
                        <p className="font-bold text-[#682c0b] mb-1">Clique para buscar o arquivo</p>
                        <p className="text-xs text-gray-500 font-medium max-w-xs">Aceitamos PNG, JPEG ou PDF. Tamanho máximo 5MB.</p>
                      </div>
                    )}
                  </div>
                  {touched.nome && errors.arquivo && <p className="text-red-500 text-xs text-center"><AlertCircle className="inline mr-1" size={12}/>{errors.arquivo}</p>}
                </div>

                {/* Termos */}
                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={autorizacao} 
                      onChange={(e) => setAutorizacao(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#ea5d35] focus:ring-[#ea5d35]" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Autorização OBRIGATÓRIA de Imagem</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Concordo e autorizo o uso da minha imagem e voz, de forma gratuita, em fotos e vídeos captados durante os Cursos Intensivos, para uso exclusivo da Escola de Dança Estações em suas redes sociais e materiais promocionais.
                    </p>
                  </div>
                </label>
                {touched.nome && errors.autorizacao && <p className="text-red-500 text-xs mt-1"><AlertCircle className="inline mr-1" size={12}/>{errors.autorizacao}</p>}

                {/* Botão Final */}
                <div className="pt-6">
                  {Object.keys(touched).length > 0 && !isValid && (
                     <p className="text-red-500 text-sm font-bold text-center mb-4 flex justify-center items-center gap-2">
                       <AlertCircle size={16} /> Preencha todos os campos obrigatórios acima.
                     </p>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-5 rounded-full font-bold tracking-widest text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${
                      isSubmitting 
                      ? 'bg-gray-400 text-white cursor-wait' 
                      : 'bg-[#ea5d35] text-white hover:bg-[#c44e2b] hover:shadow-2xl hover:-translate-y-1'
                    }`}
                  >
                    {isSubmitting ? 'ENVIANDO...' : 'ENVIAR COMPROVANTE'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
