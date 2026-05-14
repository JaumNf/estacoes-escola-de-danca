'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import { Calendar, MapPin, Clock, Music, AlertCircle, Ticket, Smartphone, CreditCard, Copy, Check, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

export default function BailePage() {
  const [ticketType, setTicketType] = useState<'individual' | 'dupla'>('individual');
  const [selectedEvent, setSelectedEvent] = useState('baile-encerramento');

  const [nome1, setNome1] = useState('');
  const [nome2, setNome2] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'credito'>('pix');
  const [copied, setCopied] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const events = [
    { id: 'baile-encerramento', name: 'Baile de Encerramento (23/05)', active: true },
    { id: 'baile-unidade-2', name: 'Baile Unidade 2 (Em breve)', active: false },
  ];

  const handleCopyPix = () => {
    navigator.clipboard.writeText('cursodeverao67@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (formaPagamento === 'pix' && !arquivo) {
      e.preventDefault();
      setFileError('Por favor, anexe o comprovante do PIX.');
      return;
    }

    setIsSubmitting(true);
    
    // Deixa o formulário ser enviado para o iframe invisível
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setNome1('');
      setNome2('');
      setArquivo(null);
      setFileError('');
    }, 2500);
  };

  const closeModal = () => {
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-violet-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-[#0a0118] text-violet-50 overflow-hidden flex items-center justify-center">
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
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118]/80 via-black/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 px-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.7, duration: 1.2 }}
            className="text-5xl md:text-6xl lg:text-8xl font-display font-black italic tracking-tight mb-6 drop-shadow-xl text-fuchsia-100"
          >
            Nossos Bailes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-violet-100 max-w-2xl mx-auto mb-10 drop-shadow-md"
          >
            A prática faz o dançarino. Venha se divertir, conhecer gente nova e colocar em prática tudo o que você aprendeu em aula.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => document.getElementById('ingressos')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-fuchsia-600 text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-fuchsia-700 transition-colors duration-300 shadow-lg inline-flex items-center gap-2"
          >
            Garanta seu Ingresso <Ticket size={20} />
          </motion.button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full z-20">
          <WaveDivider position="bottom" colorClass="fill-violet-50" />
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
          <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto text-fuchsia-600 mb-6">
            <Music size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-violet-900">O Ambiente Perfeito</h2>
          <p className="text-lg text-violet-700 leading-relaxed max-w-3xl mx-auto">
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
        className="py-20 px-6 bg-violet-100/30"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-violet-900 mb-4">Próximos Eventos</h2>
            <p className="text-violet-600">Confira a programação das nossas unidades.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Unidade 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[32px] p-8 shadow-lg shadow-violet-900/5 border border-violet-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-fuchsia-500" />
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-fuchsia-500" size={20} />
                <h3 className="font-bold text-violet-900 tracking-wide uppercase text-sm">Unidade 1</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-violet-50 rounded-xl p-3 text-center min-w-[70px] border border-violet-100">
                    <span className="block text-xl font-bold text-violet-900">23</span>
                    <span className="block text-xs font-bold text-fuchsia-500 uppercase">MAI</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold text-violet-900 mb-1">Baile de Encerramento!</h4>
                    <p className="text-violet-600 text-sm mb-2">Venha celebrar o fim de um ciclo incrível com muita dança.</p>
                    <div className="flex items-center gap-2 text-xs text-violet-500">
                      <Clock size={14} />
                      <span>Das 19h às 00h</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Unidade 2 */}
            <div className="bg-white/60 rounded-[32px] p-8 shadow-sm border border-violet-100/50 flex flex-col items-center justify-center text-center opacity-70">
              <div className="flex items-center gap-3 mb-6 opacity-50">
                <MapPin size={20} />
                <h3 className="font-bold text-violet-900 tracking-wide uppercase text-sm">Unidade 2</h3>
              </div>
              <div className="py-8">
                <Calendar className="mx-auto text-violet-300 mb-3" size={40} />
                <p className="text-violet-500 font-medium">Nenhum evento programado</p>
                <p className="text-violet-400 text-sm mt-1">Aguarde as novidades!</p>
              </div>
            </div>
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
        className="py-24 px-6 bg-[#0a0118] text-violet-50 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-900 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            <div className="space-y-8 sticky top-32">
              <div>
                <span className="text-fuchsia-400 font-bold tracking-widest uppercase text-sm mb-2 block">Venda Antecipada</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-violet-50 mb-4">Garanta seu Ingresso</h2>
                <p className="text-violet-200 text-lg leading-relaxed">
                  Compre antecipado e garanta o melhor valor para curtir o Baile de Encerramento.
                </p>
              </div>

              <div className="bg-violet-900/50 rounded-2xl p-6 border border-violet-800 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-fuchsia-400 shrink-0 mt-0.5" size={20} />
                  <div className="space-y-2">
                    <p className="text-violet-200 text-sm font-medium">Informações Importantes:</p>
                    <ul className="text-violet-400 text-xs space-y-1 list-disc list-inside">
                      <li>Vendas antecipadas encerram 2h antes do evento.</li>
                      <li>Na hora: <strong className="text-violet-200">R$ 25,00</strong> (Dinheiro ou Pix).</li>
                      <li>Acréscimo de taxas para pagamentos via link no Cartão.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 text-violet-900 shadow-2xl shadow-black/20">
              <h3 className="text-2xl font-display font-bold mb-6 text-center">Selecione seu Ingresso</h3>
              
              <iframe name="hidden_iframe_baile" id="hidden_iframe_baile" style={{ display: 'none' }} />
              <form 
                action="https://formsubmit.co/cursodeverao67@gmail.com" 
                method="POST" 
                encType="multipart/form-data" 
                target="hidden_iframe_baile"
                onSubmit={handleSubmit} 
                className="space-y-6 mb-2"
              >
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="Assunto" value={`Novo ingresso Baile: ${events.find(ev => ev.id === selectedEvent)?.name}`} />
                <input type="hidden" name="Evento" value={events.find(ev => ev.id === selectedEvent)?.name || 'N/A'} />
                <input type="hidden" name="TipoIngresso" value={ticketType === 'individual' ? 'Individual' : 'Dupla'} />
                <input type="hidden" name="FormaPagamento" value={formaPagamento === 'pix' ? 'Pix' : 'Cartão de Crédito (Link)'} />
                {/* Event Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-violet-600 uppercase tracking-wide">Evento</label>
                  <div className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => event.active && setSelectedEvent(event.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                          selectedEvent === event.id
                            ? 'border-fuchsia-500 bg-fuchsia-50'
                            : event.active 
                              ? 'border-violet-100 hover:border-violet-200'
                              : 'border-violet-100 opacity-50 cursor-not-allowed bg-violet-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedEvent === event.id ? 'border-fuchsia-500' : 'border-violet-300'
                          }`}>
                            {selectedEvent === event.id && <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />}
                          </div>
                          <span className={`font-bold ${selectedEvent === event.id ? 'text-violet-900' : 'text-violet-600'}`}>
                            {event.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-violet-600 uppercase tracking-wide">Tipo de Ingresso</label>
                  <div className="space-y-2">
                    <div
                      onClick={() => setTicketType('individual')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                        ticketType === 'individual' 
                          ? 'border-fuchsia-500 bg-fuchsia-50' 
                          : 'border-violet-100 hover:border-violet-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          ticketType === 'individual' ? 'border-fuchsia-500' : 'border-violet-300'
                        }`}>
                          {ticketType === 'individual' && <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />}
                        </div>
                        <span className="font-bold text-violet-800">Individual</span>
                      </div>
                      <span className="text-xl font-bold text-violet-900">R$ 20</span>
                    </div>

                    <div
                      onClick={() => setTicketType('dupla')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                        ticketType === 'dupla' 
                          ? 'border-fuchsia-500 bg-fuchsia-50' 
                          : 'border-violet-100 hover:border-violet-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          ticketType === 'dupla' ? 'border-fuchsia-500' : 'border-violet-300'
                        }`}>
                          {ticketType === 'dupla' && <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />}
                        </div>
                        <span className="font-bold text-violet-800">Dupla</span>
                      </div>
                      <span className="text-xl font-bold text-violet-900">R$ 35</span>
                    </div>
                  </div>
                </div>

                {/* Dados */}
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-bold text-violet-600 uppercase tracking-wide">Dados</label>
                  
                  {ticketType === 'individual' ? (
                    <div>
                      <input 
                        type="text" 
                        name="Nome"
                        required 
                        placeholder="Seu Nome Completo"
                        value={nome1}
                        onChange={(e) => setNome1(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-violet-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-violet-50/50 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        name="Nome da Pessoa 1"
                        required 
                        placeholder="Nome da Pessoa 1"
                        value={nome1}
                        onChange={(e) => setNome1(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-violet-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-violet-50/50 text-sm"
                      />
                      <input 
                        type="text" 
                        name="Nome da Pessoa 2"
                        required 
                        placeholder="Nome da Pessoa 2"
                        value={nome2}
                        onChange={(e) => setNome2(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-violet-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-violet-50/50 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Pagamento */}
                <div className="space-y-3 pt-2">
                  <label className="text-sm font-bold text-violet-600 uppercase tracking-wide">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setFormaPagamento('pix')}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                        formaPagamento === 'pix' ? 'border-fuchsia-500 bg-fuchsia-50 text-violet-900' : 'border-violet-100 hover:border-violet-200 text-violet-600'
                      }`}
                    >
                      <Smartphone size={20} className={`mx-auto mb-1 ${formaPagamento === 'pix' ? 'text-fuchsia-500' : 'text-violet-400'}`} />
                      <span className="font-bold text-sm">Pix Agora</span>
                    </div>
                    <div 
                      onClick={() => setFormaPagamento('credito')}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                        formaPagamento === 'credito' ? 'border-fuchsia-500 bg-fuchsia-50 text-violet-900' : 'border-violet-100 hover:border-violet-200 text-violet-600'
                      }`}
                    >
                      <CreditCard size={20} className={`mx-auto mb-1 ${formaPagamento === 'credito' ? 'text-fuchsia-500' : 'text-violet-400'}`} />
                      <span className="font-bold text-sm">Cartão (Link)</span>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {formaPagamento === 'pix' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-violet-50 rounded-xl p-4 border border-violet-100 overflow-hidden space-y-4"
                      >
                        <div>
                          <p className="text-xs text-violet-800 mb-2">Copie a chave PIX (E-mail) para transferir o valor do ingresso.</p>
                          <div className="flex items-center bg-white rounded-lg border border-violet-200 p-1">
                            <input type="text" readOnly value="cursodeverao67@gmail.com" className="bg-transparent px-3 py-2 flex-1 text-sm font-mono font-medium outline-none text-violet-900 w-full" />
                            <button 
                              type="button" 
                              onClick={handleCopyPix} 
                              className="bg-violet-100 text-violet-700 hover:bg-violet-200 px-3 py-2 rounded-md font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />} 
                              {copied ? 'Copiada' : 'Copiar'}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-violet-200">
                           <label className="text-sm font-bold text-violet-600 uppercase tracking-wide mb-2 block">Comprovante PIX</label>
                           <input 
                             type="file" 
                             name="attachment"
                             accept="image/*,.pdf"
                             onChange={(e) => {
                               if (e.target.files && e.target.files[0]) {
                                 setArquivo(e.target.files[0]);
                                 setFileError('');
                               }
                             }}
                             className="w-full text-sm text-violet-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                           />
                           {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
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
                  className="w-full bg-fuchsia-600 text-white py-4 mt-6 rounded-xl font-bold text-lg hover:bg-fuchsia-700 transition-colors shadow-lg shadow-fuchsia-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                >
                  <Ticket size={20} />
                  {isSubmitting ? 'Enviando...' : 'Confirmar Ingresso'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Success Modal */}
      {submitted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-violet-950/80 backdrop-blur-sm mt-0 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl relative my-auto"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-violet-900 mb-2">Tudo Certo!</h2>
            <p className="text-violet-600 mb-8 leading-relaxed">
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
                className="w-full bg-violet-100 text-violet-700 font-bold py-3 px-6 rounded-full hover:bg-violet-200 transition-colors"
              >
                Entendido!
              </button>
            </div>
          </motion.div>
        </div>
      , document.body)}

      {/* Footer */}
      <footer className="relative bg-[#0a0118] pt-20 pb-10 px-6 mt-auto border-t border-violet-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-violet-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Escola de Dança Estações. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade" className="hover:text-fuchsia-400 transition-colors underline underline-offset-2">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </main>
  );
}
