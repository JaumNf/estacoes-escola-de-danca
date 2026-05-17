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
  
  const carouselRef = useRef<HTMLDivElement>(null);

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
    },
    {
      id: 4,
      name: 'Carlos Mendes',
      rating: 5,
      content: 'As aulas são muito divertidas e a turma é super animada. Já recomendei para todos os meus amigos e familiares!'
    },
    {
      id: 5,
      name: 'Beatriz Costa',
      rating: 4,
      content: 'Ótima escola! Os professores são muito atenciosos e ajustam o ensino ao ritmo de cada aluno, sem pressão.'
    },
    {
      id: 6,
      name: 'Fernando Oliveira',
      rating: 5,
      content: 'A melhor escola de dança da cidade! A infraestrutura é excelente e a paciência dos instrutores é maravilhosa.'
    }
  ];

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRight();
        }
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Play success sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(err => console.log('Audio play failed', err));
      } catch (err) {
        console.log('Audio not supported', err);
      }

      setIsSubmitting(false);
      setSuccess(true);
      setName('');
      setFeedback('');
      setRating(5);
      
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-brown-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-6">O que dizem sobre nós</h2>
          <p className="text-lg text-brown-700 max-w-2xl mx-auto">
            Acompanhe a experiência de quem já faz parte da nossa escola e aproveite para deixar sua avaliação.
          </p>
        </div>

        {/* Carousel de Feedbacks */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold text-brown-900 border-b-2 border-terracotta inline-block pb-2">Feedbacks Recentes</h3>
            <div className="flex gap-2">
              <button onClick={scrollLeft} className="p-2 rounded-full bg-white border border-brown-200 text-brown-700 hover:bg-brown-100 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={scrollRight} className="p-2 rounded-full bg-white border border-brown-200 text-brown-700 hover:bg-brown-100 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {feedbacks.map((fb) => (
              <div 
                key={fb.id}
                className="snap-start shrink-0 w-[85%] md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-brown-100 flex flex-col gap-3 md:gap-5 h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-display font-bold text-lg md:text-xl text-brown-900 leading-tight">{fb.name}</span>
                    <div className="flex gap-0.5 shrink-0 mt-0.5 md:mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= fb.rating ? "fill-ochre text-ochre" : "text-brown-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-brown-700 text-sm md:text-base leading-relaxed italic">&quot;{fb.content}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário de Feedback */}
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl border border-brown-100 relative">
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-terracotta/5 rounded-bl-[40px] pointer-events-none" />
          <h3 className="text-xl md:text-2xl font-display font-bold text-brown-900 mb-6 md:mb-8 text-center relative z-10">Avalie Nossos Professores</h3>
          
          <form 
            action="https://formsubmit.co/gustavoissao2005@gmail.com"
            method="POST"
            target="_blank"
            encType="multipart/form-data"
            onSubmit={handleSubmit} 
            className="space-y-4 md:space-y-6 relative z-10"
          >
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value={`Novo Feedback de Avaliação: ${rating} Estrelas`} />
            <input type="hidden" name="Avaliacao" value={`${rating} Estrelas`} />
            
            <div>
              <label htmlFor="name" className="block text-xs md:text-sm font-bold tracking-wide uppercase text-brown-800 mb-1.5 md:mb-2">Seu Nome</label>
              <input 
                type="text" 
                id="name" 
                name="Nome"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base rounded-xl border border-brown-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all bg-brown-50/50"
                placeholder="Como gostaria de ser chamado?"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold tracking-wide uppercase text-brown-800 mb-2 md:mb-3">Avaliação das aulas e ensino</label>
              <div className="flex gap-1 md:gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 p-1 md:p-2 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${(hoveredRating ? star <= hoveredRating : star <= rating) ? "fill-ochre text-ochre" : "text-brown-200"}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="feedback" className="block text-xs md:text-sm font-bold tracking-wide uppercase text-brown-800 mb-1.5 md:mb-2">Conta pra gente, o que achou dos professores?</label>
              <textarea 
                id="feedback" 
                name="Mensagem"
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base rounded-xl border border-brown-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all bg-brown-50/50 resize-none"
                placeholder="Escreva aqui sua experiência..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brown-900 text-brown-50 py-3.5 md:py-4 rounded-xl font-bold tracking-wide text-base md:text-lg hover:bg-terracotta transition-colors duration-300 flex items-center justify-center gap-2 md:gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Feedback'}</span>
              {!isSubmitting && <Send size={18} className="md:w-5 md:h-5 w-4 h-4" />}
            </button>
          </form>
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
