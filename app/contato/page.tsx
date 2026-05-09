'use client';

import Header from '@/components/Header';
import WaveDivider from '@/components/WaveDivider';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Contato() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, reason: false, message: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateName = (val: string) => {
    if (!val.trim()) return 'Nome é obrigatório';
    if (val.trim().split(' ').length < 2) return 'Digite seu nome completo';
    return '';
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) return 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'E-mail inválido';
    return '';
  };

  const validatePhone = (val: string) => {
    if (!val.trim()) return 'Telefone é obrigatório';
    if (val.replace(/\D/g, '').length < 10) return 'Telefone inválido';
    return '';
  };

  const validateReason = (val: string) => {
    if (!val) return 'Selecione um motivo';
    return '';
  };

  const validateMessage = (val: string) => {
    if (!val.trim()) return 'Mensagem é obrigatória';
    if (val.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres';
    return '';
  };

  const errors = {
    name: touched.name ? validateName(name) : '',
    email: touched.email ? validateEmail(email) : '',
    phone: touched.phone ? validatePhone(phone) : '',
    reason: touched.reason ? validateReason(reason) : '',
    message: touched.message ? validateMessage(message) : '',
  };

  const isFormValid = !validateName(name) && !validateEmail(email) && !validatePhone(phone) && !validateReason(reason) && !validateMessage(message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/cursodeverao67@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nome: name,
          Email: email,
          Telefone: phone,
          Motivo: reason,
          Mensagem: message,
          _subject: `Novo contato pelo site: ${reason}`
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar a mensagem');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setReason('');
      setMessage('');
      
      // Esconde a mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      console.error('Erro completo:', error);
      alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brown-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-56 md:pb-32 px-6 bg-brown-950 text-brown-50">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">Fale Conosco</h1>
          <p className="text-xl text-brown-200 max-w-2xl mx-auto">
            Estamos aqui para tirar suas dúvidas e ajudar você a dar o primeiro passo na dança.
          </p>
        </div>
        <WaveDivider position="bottom" colorClass="fill-brown-50" />
      </section>

      {/* Contact Form Section */}
      <section className="flex-1 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-6">Informações de Contato</h2>
              <p className="text-brown-700 text-lg md:text-xl leading-relaxed">
                Tem alguma dúvida sobre nossas aulas, horários ou valores? Preencha o formulário ao lado ou entre em contato pelos nossos canais diretos.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-brown-100 flex items-center justify-center shrink-0">
                  <Phone className="text-terracotta" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-brown-900 text-lg mb-1">WhatsApp / Telefone</h3>
                  <a href="https://wa.me/5567992630948" target="_blank" rel="noopener noreferrer" className="text-brown-700 hover:text-terracotta transition-colors text-lg">
                    (67) 99263-0948
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-brown-100 flex items-center justify-center shrink-0">
                  <Mail className="text-terracotta" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-brown-900 text-lg mb-1">E-mail</h3>
                  <a href="mailto:cursodeverao67@gmail.com" className="text-brown-700 hover:text-terracotta transition-colors text-lg">
                    cursodeverao67@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-brown-100 flex items-center justify-center shrink-0">
                  <MapPin className="text-terracotta" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-brown-900 text-lg mb-1">Nossas Unidades</h3>
                  <p className="text-brown-700 text-lg">
                    Centro: R. Barão de Melgaço, 177<br />
                    Oeste: R. Carvalho, 319
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-brown-900/5 border border-brown-100">
            <h3 className="text-2xl font-display font-bold text-brown-900 mb-8">Envie uma mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`w-full px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-brown-50/50 ${
                    errors.name ? 'border-red-400 focus:ring-red-400' : 'border-brown-200 focus:ring-terracotta'
                  }`}
                  placeholder="Seu nome"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-brown-50/50 ${
                    errors.email ? 'border-red-400 focus:ring-red-400' : 'border-brown-200 focus:ring-terracotta'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  id="phone" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => setTouched({ ...touched, phone: true })}
                  className={`w-full px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-brown-50/50 ${
                    errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-brown-200 focus:ring-terracotta'
                  }`}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">Motivo do Contato</label>
                <div className="relative">
                  <select 
                    id="reason" 
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={() => setTouched({ ...touched, reason: true })}
                    className={`w-full px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-brown-50/50 appearance-none text-brown-800 ${
                      errors.reason ? 'border-red-400 focus:ring-red-400' : 'border-brown-200 focus:ring-terracotta'
                    }`}
                  >
                    <option value="" disabled>Selecione um motivo...</option>
                    <option value="Aulas Regulares">Aulas Regulares</option>
                    <option value="Cursos Intensivos">Cursos Intensivos</option>
                    <option value="Baile">Baile</option>
                    <option value="Parcerias">Parcerias</option>
                    <option value="Outros">Outros</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-brown-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">Mensagem</label>
                <textarea 
                  id="message" 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => setTouched({ ...touched, message: true })}
                  rows={5}
                  className={`w-full px-5 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-brown-50/50 resize-none ${
                    errors.message ? 'border-red-400 focus:ring-red-400' : 'border-brown-200 focus:ring-terracotta'
                  }`}
                  placeholder="Como podemos te ajudar?"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || (!isFormValid && Object.values(touched).some(Boolean))}
                className="w-full bg-brown-900 text-brown-50 py-5 rounded-2xl font-bold tracking-wide text-lg hover:bg-terracotta transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg shadow-brown-900/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                {!isSubmitting && <Send size={20} />}
              </button>

              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-800">
                  <CheckCircle className="text-green-600 shrink-0" size={24} />
                  <p className="font-medium">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                </div>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-brown-950 pt-32 pb-20 md:pt-48 md:pb-20 px-6 mt-auto">
        <WaveDivider position="top" colorClass="fill-brown-50" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="font-display font-bold text-4xl text-ochre">ESTAÇÕES</div>
            <p className="text-brown-200 max-w-md text-lg leading-relaxed">
              Nossa proposta é mostrar que todo mundo pode dançar. Venha desenvolver sua consciência corporal, musicalidade e o prazer em dançar em um ambiente acolhedor.
            </p>
            <div className="flex gap-4">
              <a href="https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-brown-800 flex items-center justify-center text-brown-100 hover:bg-terracotta hover:text-white transition-colors animate-pulse hover:animate-none shadow-[0_0_15px_rgba(217,119,87,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-2xl text-ochre mb-6">Links Rápidos</h4>
            <ul className="space-y-4 text-brown-200 text-lg">
              <li><Link href="/#sobre" className="hover:text-terracotta transition-colors">Sobre Nós</Link></li>
              <li><Link href="/#aulas" className="hover:text-terracotta transition-colors">Nossas Aulas</Link></li>
              <li><Link href="/#trabalhos" className="hover:text-terracotta transition-colors">Trabalhos</Link></li>
              <li><Link href="/#unidades" className="hover:text-terracotta transition-colors">Unidades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-2xl text-ochre mb-6">Contato</h4>
            <ul className="space-y-4 text-brown-200 text-lg">
              <li>
                <a href="mailto:cursodeverao67@gmail.com" className="hover:text-terracotta transition-colors">
                  cursodeverao67@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/5567992630948" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
                  (67) 99263-0948
                </a>
              </li>
              <li>Seg - Sex: 08h às 22h</li>
              <li>Sáb: 09h às 14h</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-brown-800 flex flex-col md:flex-row items-center justify-between gap-4 text-brown-400">
          <p>&copy; {new Date().getFullYear()} Escola de Dança Estações. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade" className="hover:text-terracotta transition-colors underline underline-offset-2">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </main>
  );
}
