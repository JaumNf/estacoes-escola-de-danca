'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeedbackSection() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  const feedbacks = [
    {
      id: 1,
      name: 'Mariana Silva',
      rating: 5,
      content: 'Ambiente maravilhoso e super acolhedor! Os professores são fantásticos e têm uma paciência incrível para ensinar quem está começando do zero.'
    },
    {
      id: 2,
      name: 'João Pedro',
      rating: 5,
      content: 'Nunca pensei que conseguiria aprender a dançar tão rápido. A metodologia deles me deu muita confiança no salão.'
    },
    {
      id: 3,
      name: 'Ana Laura',
      rating: 5,
      content: 'Fiz o curso intensivo e amei! A didática dos professores é diferente de tudo que já vi, a aula passa voando e quando você vê, já está dançando.'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [feedbacks.length]);

  const nextFeedback = () => setCurrentFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
  const prevFeedback = () => setCurrentFeedbackIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          Avaliacao: `${rating} Estrelas`,
          Mensagem: feedback,
          _subject: `Novo Feedback de Avaliação: ${rating} Estrelas`
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o feedback');
      }

      // Play success sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      } catch (err) {
        console.log('Audio not supported', err);
      }

      setSuccess(true);
      setName('');
      setFeedback('');
      setRating(5);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      console.error('Erro completo:', error);
      alert('Ocorreu um erro ao enviar seu feedback. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-brown-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-6">O que dizem sobre nós</h2>
          <p className="text-lg text-brown-700 max-w-2xl mx-auto">
            Acompanhe a experiência de quem já faz parte da nossa escola e aproveite para deixar sua avaliação.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Feedbacks Exibidos */}
          <div className="space-y-6 flex flex-col h-full justify-center">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display font-bold text-brown-900 border-b-2 border-terracotta inline-block pb-2">Feedbacks Recentes</h3>
              <div className="flex gap-2">
                <button onClick={prevFeedback} className="p-2 rounded-full bg-white border border-brown-200 text-brown-700 hover:bg-brown-100 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextFeedback} className="p-2 rounded-full bg-white border border-brown-200 text-brown-700 hover:bg-brown-100 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative min-h-[300px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentFeedbackIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-brown-100 flex flex-col gap-6 w-full"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-display font-bold text-2xl text-brown-900">{feedbacks[currentFeedbackIndex].name}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={20} 
                          className={star <= feedbacks[currentFeedbackIndex].rating ? "fill-ochre text-ochre" : "text-brown-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-brown-700 text-lg leading-relaxed italic">&quot;{feedbacks[currentFeedbackIndex].content}&quot;</p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              {feedbacks.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFeedbackIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentFeedbackIndex ? 'bg-terracotta' : 'bg-brown-200'}`}
                />
              ))}
            </div>
          </div>

          {/* Formulário de Feedback */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl border border-brown-100 sticky top-32">
            <h3 className="text-2xl font-display font-bold text-brown-900 mb-8 text-center">Avalie Nossos Professores</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">Seu Nome</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-brown-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all bg-brown-50/50"
                  placeholder="Como gostaria de ser chamado?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-3">Avaliação das aulas e ensino</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-2 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`transition-colors ${(hoveredRating ? star <= hoveredRating : star <= rating) ? "fill-ochre text-ochre" : "text-brown-200"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-bold tracking-wide uppercase text-brown-800 mb-2">Conta pra gente, o que achou dos professores?</label>
                <textarea 
                  id="feedback" 
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 rounded-xl border border-brown-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all bg-brown-50/50 resize-none"
                  placeholder="Escreva aqui sobre sua experiência com nossos professores e a metodologia..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brown-900 text-brown-50 py-4 rounded-xl font-bold tracking-wide text-lg hover:bg-terracotta transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Feedback'}</span>
                {!isSubmitting && <Send size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown-950/80 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full shadow-2xl border-4 border-green-500 text-center flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={64} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-display font-bold text-brown-900">Muito Obrigado!</h3>
                <p className="text-brown-600 text-lg">Seu feedback foi recebido com sucesso. Ele é muito importante para nós!</p>
              </div>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-4 px-8 py-4 bg-terracotta text-white rounded-full font-bold tracking-wide hover:bg-ochre transition-colors w-full"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
