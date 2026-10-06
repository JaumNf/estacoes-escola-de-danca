'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, CheckCircle } from 'lucide-react';

export default function FeedbackSection() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !feedback) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Play success sound
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(err => console.log('Audio play failed', err));
      } catch (err) {
        console.log('Audio not supported', err);
      }

      setIsSubmitting(false);
      setSuccess(true);
      setShowForm(false);
      setName('');
      setFeedback('');
      setRating(5);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Erro ao enviar feedback. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-brown-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-4">O que dizem sobre nós</h2>
          <p className="text-lg text-brown-700 max-w-2xl mx-auto">
            Já dançou com a gente? Conte como foi. As avaliações de quem passou por aqui aparecem nesta página.
          </p>
        </div>

        {/* Sem depoimentos publicados ainda — o formulário abaixo é a origem deles. */}
        <div className="max-w-3xl mx-auto mb-8 text-center bg-white/60 border border-dashed border-brown-200 rounded-3xl px-6 py-10">
          <Star size={28} className="mx-auto mb-4 text-ochre" />
          <h3 className="text-xl md:text-2xl font-display font-bold text-brown-900 mb-2">
            Nenhuma avaliação publicada ainda
          </h3>
          <p className="text-brown-700 max-w-md mx-auto">
            Estamos reunindo as avaliações dos nossos alunos. Se você já dançou com a gente, sua
            opinião pode ser a primeira a aparecer aqui.
          </p>
        </div>

        {/* Formulário de Feedback */}
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-xl border border-brown-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-terracotta/5 rounded-bl-[40px] pointer-events-none" />
          <h3 className="text-xl md:text-2xl font-display font-bold text-brown-900 mb-6 md:mb-8 text-center relative z-10">Avalie Nossos Professores</h3>
          
          {!showForm ? (
            <div className="text-center relative z-10">
              <p className="text-brown-700 mb-6">Sua opinião é muito importante para continuarmos melhorando!</p>
              <button 
                onClick={() => setShowForm(true)}
                className="pressable bg-terracotta text-white px-8 py-4 rounded-full font-bold tracking-wide hover:bg-ochre shadow-lg cursor-pointer"
              >
                Adicionar Feedback
              </button>
            </div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              action="https://formsubmit.co/cursodeverao67@gmail.com"
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
                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base rounded-xl border border-brown-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-[border-color,box-shadow] bg-brown-50/50"
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
                    className="pressable p-1 p-1 md:p-2 focus:outline-none"
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
                className="w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base rounded-xl border border-brown-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-[border-color,box-shadow] bg-brown-50/50 resize-none"
                placeholder="Escreva aqui sua experiência..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brown-900 text-brown-50 py-3.5 md:py-4 rounded-xl font-bold tracking-wide text-base md:text-lg hover:bg-terracotta transition-colors flex items-center justify-center gap-2 md:gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Feedback'}</span>
              {!isSubmitting && <Send size={18} className="md:w-5 md:h-5 w-4 h-4" />}
            </button>
          </motion.form>
          )}
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
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
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
                className="pressable mt-4 px-8 py-4 bg-terracotta text-white rounded-full font-bold tracking-wide hover:bg-ochre w-full"
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
