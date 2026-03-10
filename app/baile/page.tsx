'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import { Calendar, MapPin, Clock, ArrowRight, Music, Users, AlertCircle, Ticket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

export default function BailePage() {
  const [ticketType, setTicketType] = useState<'individual' | 'dupla'>('individual');
  const [selectedEvent, setSelectedEvent] = useState('baile-boas-vindas');

  const events = [
    { id: 'baile-boas-vindas', name: 'Baile de Boas Vindas (28/03)', active: true },
    { id: 'baile-unidade-2', name: 'Baile Unidade 2 (Em breve)', active: false },
  ];

  const handleWhatsAppRedirect = () => {
    const event = events.find(e => e.id === selectedEvent);
    let mensagem = `Olá! Gostaria de comprar ingresso antecipado para o *${event?.name}*.%0A%0A`;
    mensagem += `*Tipo de Ingresso:* ${ticketType === 'individual' ? 'Individual (R$ 20)' : 'Dupla (R$ 35)'}%0A`;
    
    const whatsappUrl = `https://wa.me/5567992630948?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 drop-shadow-lg"
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
                    <span className="block text-xl font-bold text-violet-900">28</span>
                    <span className="block text-xs font-bold text-fuchsia-500 uppercase">MAR</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold text-violet-900 mb-1">Baile de Boas Vindas!</h4>
                    <p className="text-violet-600 text-sm mb-2">Venha celebrar o início de um novo ciclo com muita dança.</p>
                    <div className="flex items-center gap-2 text-xs text-violet-500">
                      <Clock size={14} />
                      <span>A partir das 20h</span>
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
              <div>
                <span className="text-fuchsia-400 font-bold tracking-widest uppercase text-sm mb-2 block">Venda Antecipada</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-violet-50 mb-4">Garanta seu Ingresso</h2>
                <p className="text-violet-200 text-lg leading-relaxed">
                  Compre antecipado e garanta o melhor valor para curtir o Baile de Boas Vindas.
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
                      <li>Acréscimo de <strong className="text-violet-200">R$ 5,00</strong> para pagamentos em Cartão de Crédito/Débito na portaria.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 text-violet-900 shadow-2xl shadow-black/20">
              <h3 className="text-2xl font-display font-bold mb-6 text-center">Selecione seu Ingresso</h3>
              
              <div className="space-y-6 mb-8">
                {/* Event Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-violet-600 uppercase tracking-wide">Evento</label>
                  <div className="space-y-2">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => event.active && setSelectedEvent(event.id)}
                        disabled={!event.active}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group text-left ${
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
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ticket Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-violet-600 uppercase tracking-wide">Tipo de Ingresso</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setTicketType('individual')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
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
                    </button>

                    <button
                      onClick={() => setTicketType('dupla')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
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
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-fuchsia-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-violet-800 transition-colors shadow-lg shadow-fuchsia-500/20 flex items-center justify-center gap-2"
              >
                <Ticket size={20} />
                Comprar Antecipado
              </button>
              <p className="text-center text-xs text-violet-500 mt-4">
                Você será redirecionado para o WhatsApp para finalizar o pagamento.
              </p>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative bg-[#0a0118] pt-20 pb-10 px-6 mt-auto border-t border-violet-900/30">
        <div className="max-w-7xl mx-auto text-center text-violet-400 text-sm">
          &copy; {new Date().getFullYear()} Escola de Dança Estações. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}
