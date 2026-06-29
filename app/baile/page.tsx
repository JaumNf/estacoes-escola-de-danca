'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import { Calendar, MapPin, Clock, Music, AlertCircle, Ticket, Smartphone, CreditCard, Copy, Check, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

export default function BailePage() {
  const [ticketType, setTicketType] = useState<'individual' | 'dupla'>('individual');
  const [selectedEvent, setSelectedEvent] = useState('baile-julino');
  const [currentStep, setCurrentStep] = useState(1);

  const [nome1, setNome1] = useState('');
  const [nome2, setNome2] = useState('');
  const [tel1, setTel1] = useState('');
  const [tel2, setTel2] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'credito'>('pix');
  const [copied, setCopied] = useState(false);
  const [comprovante, setComprovante] = useState<File | null>(null);
      
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const events = [
    { id: 'baile-julino', name: 'Baile Edição Julina: Teatro do Mundo (25/07)', active: true },
    { id: 'baile-unidade-2', name: 'Baile Unidade 2 (Em breve)', active: false },
  ];

  const handleCopyPix = () => {
    navigator.clipboard.writeText('cursodeverao67@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const eventName = events.find(ev => ev.id === selectedEvent)?.name || 'N/A';
    
    if (formaPagamento === 'pix') {
      // Allow the form to submit natively via the iframe
      setIsSubmitting(true);
      // formsubmit.co will respond to the iframe.
      // Set a short delay to consider it submitted.
      setTimeout(() => {
        setSubmitted(true);
        setNome1('');
        setNome2('');
        setTel1('');
        setTel2('');
        setComprovante(null);
        setIsSubmitting(false);
      }, 2000);
    } else {
      e.preventDefault();
      setIsSubmitting(true);
      const msg = `*Compra de Ingresso Baile*%0A%0A*Evento:* ${eventName}%0A*Tipo de Ingresso:* ${ticketType === 'individual' ? 'Individual' : 'Dupla'}%0A*Forma de Pagamento:* Cartão de Crédito (Link)%0A%0A*Nome:* ${nome1}%0A*Telefone:* ${tel1}${ticketType === 'dupla' ? `%0A%0A*Nome 2:* ${nome2}%0A*Telefone 2:* ${tel2}` : ''}`;
      
      const whatsappUrl = `https://wa.me/5567992630948?text=${msg}`;
      window.open(whatsappUrl, '_blank');
      setSubmitted(true);
      setNome1('');
      setNome2('');
      setTel1('');
      setTel2('');
      setComprovante(null);
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSubmitted(false);
    setCurrentStep(1);
  };

  return (
    <main className="min-h-screen bg-[#fffcf5] flex flex-col relative before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] before:opacity-60 before:pointer-events-none before:z-[100]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-[#311707] text-orange-50 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/d/1UBqXIC4Xy9jtx8D63VJVdtE5vPPNmddN"
            alt="Baile de Dança"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
            unoptimized
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#311707]/90 via-black/50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-30 px-6 mt-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.7, duration: 1.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] text-white"
          >
            Nossos Bailes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-orange-50 max-w-2xl mx-auto mb-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-medium"
          >
            A prática faz o dançarino. Venha se divertir, conhecer gente nova e colocar em prática tudo o que você aprendeu em aula.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              document.getElementById('ingressos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-rose-600 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-rose-800 transition-colors duration-300 shadow-lg inline-flex items-center gap-2 relative z-50 pointer-events-auto"
          >
            Garanta seu Ingresso <Ticket size={20} />
          </motion.button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <WaveDivider position="bottom" colorClass="fill-orange-50" />
        </div>
      </section>

      {/* Sobre o Baile */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-6">
            <Music size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b]">O Ambiente Perfeito</h2>
          <p className="text-lg text-[#644230] leading-relaxed max-w-3xl mx-auto">
            Nossos bailes são pensados para serem o ambiente mais acolhedor e divertido possível. 
            Aqui, o objetivo não é a perfeição, mas a conexão. Com iluminação aconchegante, 
            música de qualidade e uma comunidade vibrante, você vai descobrir que a dança de salão 
            é muito mais do que passos: é sobre se sentir bem.
          </p>
        </div>
      </motion.section>

      {/* Agenda */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 px-6 bg-[#fae8d4]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-4">Próximos Eventos</h2>
            <p className="text-[#874c2e]">Confira a programação das nossas unidades.</p>
          </div>

          <div className="max-w-xl mx-auto">
            {/* Teatro do Mundo */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] p-8 shadow-lg shadow-orange-900/5 border border-orange-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500" />
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-rose-500" size={20} />
                <h3 className="font-bold text-[#682c0b] tracking-wide uppercase text-sm">Teatro do Mundo</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#fffcf5] rounded-xl p-3 text-center min-w-[70px] border border-orange-100">
                    <span className="block text-xl font-bold text-[#682c0b]">25</span>
                    <span className="block text-xs font-bold text-orange-500 uppercase">JUL</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold text-[#682c0b] mb-1">Baile Edição Julina!</h4>
                    <p className="text-[#874c2e] text-sm mb-2">
                      Venha se divertir na nossa festa julina! <strong>Haverá uma feira de festa julina na parte de fora do baile.</strong>
                    </p>
                    <div className="flex items-center gap-2 text-xs text-orange-500">
                      <Clock size={14} />
                      <span>Das 19h às 00h</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Compra de Ingressos */}
      <motion.section 
        id="ingressos"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-6 bg-[#311707] text-orange-50 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            <div className="space-y-8 md:sticky md:top-32">
              <div>
                <span className="text-rose-500 font-bold tracking-widest uppercase text-sm mb-2 block">Venda Antecipada</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-50 mb-4">Garanta seu Ingresso</h2>
                <p className="text-orange-200 text-lg leading-relaxed">
                  Compre antecipado e garanta o melhor valor para curtir o Baile de Encerramento.
                </p>
              </div>

              <div className="bg-orange-900/50 rounded-2xl p-6 border border-orange-800 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                  <div className="space-y-2">
                    <p className="text-orange-200 text-sm font-medium">Informações Importantes:</p>
                    <ul className="text-orange-400 text-xs space-y-1 list-disc list-inside">
                      <li>Vendas antecipadas encerram 2h antes do evento.</li>
                      <li>Na hora: <strong className="text-orange-200">R$ 25,00</strong> (Dinheiro ou Pix).</li>
                      <li>Acréscimo de taxas para pagamentos via link no Cartão.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 text-[#682c0b] shadow-2xl shadow-black/20">
              <h3 className="text-2xl font-display font-bold mb-6 text-center">Selecione seu Ingresso</h3>
              
              <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>
              <form 
                action="https://formsubmit.co/cursodeverao67@gmail.com"
                method="POST"
                encType="multipart/form-data"
                target={formaPagamento === 'pix' ? 'hidden_iframe' : ''}
                onSubmit={handleSubmit} 
                className="space-y-6 mb-2"
              >
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="Evento" value={events.find(ev => ev.id === selectedEvent)?.name || 'N/A'} />
                <input type="hidden" name="Tipo de Ingresso" value={ticketType === 'individual' ? 'Individual' : 'Dupla'} />
                
                {currentStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Event Selection */}
                    <div className="space-y-3">
                  <label className="text-sm font-bold text-[#874c2e] uppercase tracking-wide">Evento</label>
                  <div className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => event.active && setSelectedEvent(event.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                          selectedEvent === event.id
                            ? 'border-rose-500 bg-rose-50'
                            : event.active 
                              ? 'border-orange-100 hover:border-orange-200'
                              : 'border-orange-100 opacity-50 cursor-not-allowed bg-[#fffcf5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedEvent === event.id ? 'border-rose-500' : 'border-orange-300'
                          }`}>
                            {selectedEvent === event.id && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                          </div>
                          <span className={`font-bold ${selectedEvent === event.id ? 'text-[#682c0b]' : 'text-[#874c2e]'}`}>
                            {event.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#874c2e] uppercase tracking-wide">Tipo de Ingresso</label>
                  <div className="space-y-2">
                    <div
                      onClick={() => setTicketType('individual')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                        ticketType === 'individual' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-orange-100 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          ticketType === 'individual' ? 'border-rose-500' : 'border-orange-300'
                        }`}>
                          {ticketType === 'individual' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                        </div>
                        <span className="font-bold text-[#682c0b]">Individual</span>
                      </div>
                      <span className="text-xl font-bold text-[#682c0b]">R$ 20</span>
                    </div>

                    <div
                      onClick={() => setTicketType('dupla')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                        ticketType === 'dupla' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-orange-100 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          ticketType === 'dupla' ? 'border-rose-500' : 'border-orange-300'
                        }`}>
                          {ticketType === 'dupla' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                        </div>
                        <span className="font-bold text-[#682c0b]">Dupla</span>
                      </div>
                      <span className="text-xl font-bold text-[#682c0b]">R$ 35</span>
                    </div>
                  </div>
                </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-rose-600 text-white py-4 mt-6 rounded-xl font-bold text-lg hover:bg-rose-800 transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Continuar para Pagamento
                      <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(1)}
                      className="text-sm font-bold text-[#874c2e] hover:text-[#682c0b] flex items-center gap-1 transition-colors -mt-2 mb-2"
                    >
                      <ArrowLeft size={16} /> Voltar
                    </button>
                    {/* Dados */}
                    <div className="space-y-3 pt-2">
                  <label className="text-sm font-bold text-[#874c2e] uppercase tracking-wide">Dados</label>
                  
                  {ticketType === 'individual' ? (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        name="Nome"
                        required 
                        placeholder="Seu Nome Completo"
                        value={nome1}
                        onChange={(e) => setNome1(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fffcf5]/50 text-sm"
                      />
                      <input 
                        type="tel" 
                        name="Telefone"
                        required 
                        placeholder="Seu WhatsApp"
                        value={tel1}
                        onChange={(e) => setTel1(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fffcf5]/50 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col gap-3 md:flex-row">
                        <input 
                          type="text" 
                          name="Nome da Pessoa 1"
                          required 
                          placeholder="Nome da Pessoa 1"
                          value={nome1}
                          onChange={(e) => setNome1(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fffcf5]/50 text-sm"
                        />
                        <input 
                          type="tel" 
                          name="Telefone da Pessoa 1"
                          required 
                          placeholder="WhatsApp Pessoa 1"
                          value={tel1}
                          onChange={(e) => setTel1(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fffcf5]/50 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-3 md:flex-row">
                        <input 
                          type="text" 
                          name="Nome da Pessoa 2"
                          required 
                          placeholder="Nome da Pessoa 2"
                          value={nome2}
                          onChange={(e) => setNome2(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fffcf5]/50 text-sm"
                        />
                        <input 
                          type="tel" 
                          name="Telefone da Pessoa 2"
                          required 
                          placeholder="WhatsApp Pessoa 2"
                          value={tel2}
                          onChange={(e) => setTel2(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fffcf5]/50 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagamento */}
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-bold text-[#874c2e] uppercase tracking-wide">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setFormaPagamento('pix')}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                        formaPagamento === 'pix' ? 'border-rose-500 bg-rose-50 text-[#682c0b]' : 'border-orange-100 hover:border-orange-200 text-[#874c2e]'
                      }`}
                    >
                      <Smartphone size={20} className={`mx-auto mb-1 ${formaPagamento === 'pix' ? 'text-rose-500' : 'text-orange-400'}`} />
                      <span className="font-bold text-sm">Pix Agora</span>
                    </div>
                    <div 
                      onClick={() => setFormaPagamento('credito')}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                        formaPagamento === 'credito' ? 'border-rose-500 bg-rose-50 text-[#682c0b]' : 'border-orange-100 hover:border-orange-200 text-[#874c2e]'
                      }`}
                    >
                      <CreditCard size={20} className={`mx-auto mb-1 ${formaPagamento === 'credito' ? 'text-rose-500' : 'text-orange-400'}`} />
                      <span className="font-bold text-sm">Cartão (Link)</span>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {formaPagamento === 'pix' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#fffcf5] rounded-xl p-4 border border-orange-100 overflow-hidden space-y-4"
                      >
                        <div>
                          <p className="text-xs text-[#682c0b] mb-2">Copie a chave PIX (E-mail) para transferir o valor do ingresso.</p>
                          <div className="flex items-center bg-white rounded-lg border border-orange-200 p-1">
                            <input type="text" readOnly value="cursodeverao67@gmail.com" className="bg-transparent px-3 py-2 flex-1 text-sm font-mono font-medium outline-none text-[#682c0b] w-full" />
                            <button 
                              type="button" 
                              onClick={handleCopyPix} 
                              className="bg-orange-100 text-[#644230] hover:bg-orange-200 px-3 py-2 rounded-md font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />} 
                              {copied ? 'Copiada' : 'Copiar'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[#682c0b] mb-2 font-bold">Anexar Comprovante PIX</p>
                          <input 
                            type="file" 
                            name="Comprovante"
                            accept="image/*,.pdf"
                            onChange={(e) => setComprovante(e.target.files ? e.target.files[0] : null)}
                            className="bg-white border border-orange-200 text-[#874c2e] focus:border-rose-500 rounded-lg p-2 text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-[#644230] hover:file:bg-orange-200 cursor-pointer transition-colors"
                            required={formaPagamento === 'pix'}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {formaPagamento === 'credito' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-50 rounded-xl p-4 border border-amber-100 overflow-hidden"
                      >
                        <p className="text-xs text-amber-800 flex gap-2">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>Enviaremos um link de pagamento seguro para o seu número/e-mail para finalizar a compra no cartão. Pode haver acréscimo de taxas da maquininha/plataforma.</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-rose-600 text-white py-4 mt-6 rounded-xl font-bold text-lg hover:bg-rose-800 transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                    >
                      <Ticket size={20} />
                      {isSubmitting ? 'Enviando...' : 'Confirmar Ingresso'}
                    </button>
                  </motion.div>
                )}
              </form>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Success Modal */}
      {submitted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-orange-950/80 backdrop-blur-sm mt-0 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl relative my-auto"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-[#682c0b] mb-2">Tudo Certo!</h2>
            <p className="text-[#874c2e] mb-8 leading-relaxed">
              Deu tudo certo com o seu ingresso! 
              {formaPagamento === 'pix' ? ' Recebemos o seu comprovante.' : ' Enviaremos seu link de pagamento em breve, ou você pode solicitá-lo no grupo do WhatsApp.'}
              <br/><br/>
              Agora é só esperar o dia do baile e vir se divertir com a gente! 🎉
            </p>
            <div className="space-y-3">
              <Link
                href="https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T"
                target="_blank"
                className="w-full bg-[#25D366] text-white font-bold py-3 px-6 rounded-full hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone size={20} />
                Entrar na Comunidade
              </Link>
              <button 
                onClick={closeModal}
                className="w-full bg-orange-100 text-[#644230] font-bold py-3 px-6 rounded-full hover:bg-orange-200 transition-colors"
              >
                Entendido!
              </button>
            </div>
          </motion.div>
        </div>
      , document.body)}

      {/* Footer */}
      <footer className="relative bg-[#311707] pt-20 pb-10 px-6 mt-auto border-t border-orange-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-orange-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Estações Escola de Dança. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade" className="hover:text-rose-500 transition-colors underline underline-offset-2">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </main>
  );
}
