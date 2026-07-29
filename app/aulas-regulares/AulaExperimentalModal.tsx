import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, ArrowRight } from 'lucide-react';

interface AulaExperimentalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AulaExperimentalModal({ isOpen, onClose }: AulaExperimentalModalProps) {
  const [turma, setTurma] = useState('');

  const turmas = [
    { horario: '18h40 - 19h40', nome: 'Forró', detalhe: 'Do zero (Segunda-feira)', esgotada: false },
    { horario: '19h50 - 20h50', nome: 'Bachata', detalhe: 'Do zero (Segunda-feira)', esgotada: false },
    { horario: '21h00 - 22h00', nome: 'Bachata', detalhe: 'Iniciado (Segunda-feira)', esgotada: false },
    { horario: '18h40 - 19h40', nome: 'Samba de Gafieira', detalhe: 'Do zero (Terça-feira)', esgotada: false },
    { horario: '19h50 - 20h50', nome: 'Forró', detalhe: 'Iniciado (Terça-feira)', esgotada: false },
    { horario: '21h00 - 22h00', nome: 'Zouk', detalhe: 'Do zero (Terça-feira)', esgotada: false },
  ];

  const handleWhatsApp = () => {
    if (!turma) return;
    
    const unidadeNome = 'Teatro do Mundo';
    const mensagem = `Olá! Gostaria de agendar minha aula experimental!%0A%0A*Unidade:* ${unidadeNome}%0A*Turma:* ${turma}`;
    
    const whatsappUrl = `https://wa.me/5567992630948?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] p-6 md:p-8 shadow-2xl flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-orange-100 text-orange-900 rounded-full hover:bg-orange-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8 pr-12">
              <h2 className="text-3xl font-display font-bold text-orange-900 mb-2">Agendar Aula Experimental</h2>
              <p className="text-orange-700">Escolha a turma que deseja participar.</p>
              <p className="text-sm font-bold text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded-full border border-green-200">
                ✨ A aula experimental é gratuita!
              </p>
            </div>

            <div className="space-y-6 flex-grow">
              {/* Turmas */}
              <div className="space-y-3">
                <label className="block text-sm font-bold tracking-wide uppercase text-orange-800">Turma</label>
                <div className="space-y-3">
                  {turmas.map((t, index) => (
                    <button
                      key={`${t.nome}-${index}`}
                      type="button"
                      disabled={t.esgotada}
                      onClick={() => setTurma(`${t.nome} - ${t.detalhe}`)}
                      className={`w-full text-left flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        t.esgotada
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : turma === `${t.nome} - ${t.detalhe}`
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 text-orange-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <Clock className={t.esgotada ? 'text-gray-400' : turma === `${t.nome} - ${t.detalhe}` ? 'text-orange-600' : 'text-orange-400'} size={20} />
                        <span className={`font-bold ${t.esgotada ? 'text-gray-500' : turma === `${t.nome} - ${t.detalhe}` ? 'text-orange-600' : 'text-orange-600'}`}>
                          {t.horario}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold">{t.nome}</h4>
                        <p className="text-sm opacity-80">{t.detalhe}</p>
                      </div>
                      {t.esgotada && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shrink-0">
                          Esgotada
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 mt-4">
              <button 
                onClick={handleWhatsApp}
                disabled={!turma}
                className="w-full bg-[#25D366] text-white py-4 px-6 rounded-full font-bold tracking-wide text-lg hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
                Agendar pelo WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
