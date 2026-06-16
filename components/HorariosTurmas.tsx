'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, Search, ArrowRight, Bell, Loader2 } from 'lucide-react';

interface Turma {
  id: string;
  ritmo: string;
  nivel: string;
  horario: string;
  unidade: string;
  dia: string;
  esgotada: boolean;
}

const turmasOriginal: Turma[] = [
  { id: '1', ritmo: 'Vanera e Chamamé', nivel: 'Do zero', horario: '18h20 - 19h20', unidade: 'Teatro do Mundo', dia: 'Terça-feira', esgotada: false },
  { id: '2', ritmo: 'Forró', nivel: 'Do zero', horario: '19h30 - 20h30', unidade: 'Teatro do Mundo', dia: 'Terça-feira', esgotada: false },
  { id: '3', ritmo: 'Bachata', nivel: 'Do zero', horario: '20h40 - 21h40', unidade: 'Teatro do Mundo', dia: 'Terça-feira', esgotada: false },
  { id: '4', ritmo: 'Dança de Salão em Geral', nivel: 'Vanera, Chamamé, Bolero, etc.', horario: '18h20 - 19h20', unidade: 'Templo Nambei', dia: 'Quinta-feira', esgotada: false },
  { id: '5', ritmo: 'Forró', nivel: 'Do zero', horario: '19h30 - 20h30', unidade: 'Templo Nambei', dia: 'Quinta-feira', esgotada: false },
];

export default function HorariosTurmas() {
  const [filter, setFilter] = useState('');
  const [activeAviseMe, setActiveAviseMe] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const turmasFiltradas = turmasOriginal.filter(turma => {
    const termo = filter.toLowerCase();
    return (
      turma.ritmo.toLowerCase().includes(termo) ||
      turma.dia.toLowerCase().includes(termo) ||
      turma.unidade.toLowerCase().includes(termo) ||
      turma.horario.toLowerCase().includes(termo)
    );
  });

  const turmasAgrupadas = turmasFiltradas.reduce((acc, turma) => {
    const key = `${turma.unidade} - ${turma.dia}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(turma);
    return acc;
  }, {} as Record<string, Turma[]>);

  const handleAviseMe = async (e: React.FormEvent, turmaId: string) => {
    e.preventDefault();
    if (!email) return;
    
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setActiveAviseMe(null);
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Houve um erro. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-orange-900 mb-6">Horários e Turmas</h2>
        <p className="text-lg text-orange-700 max-w-2xl mx-auto mb-8">
          Encontre a turma perfeita para a sua rotina.
        </p>
        
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-orange-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-sm text-orange-900 placeholder:text-orange-300"
            placeholder="Pesquise por ritmo, dia ou local..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(turmasAgrupadas).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[40px] border border-orange-100 shadow-sm">
            <p className="text-orange-500 text-lg">Nenhuma turma encontrada para &quot;{filter}&quot;.</p>
          </div>
        ) : (
          Object.entries(turmasAgrupadas).map(([grupo, turmas]) => (
            <div key={grupo} className="group bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-orange-900/5 border border-orange-100 hover:-translate-y-2 hover:shadow-2xl hover:border-fuchsia-500 transition-all duration-300 relative">
              {grupo.includes('Templo Nambei') && (
                <div className="absolute -top-4 -right-4 bg-fuchsia-500 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg transform rotate-12 z-10">NOVIDADE!</div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-b border-orange-100 pb-6">
                <div className="w-12 h-12 rounded-full border-2 border-orange-600 group-hover:border-fuchsia-500 flex items-center justify-center shrink-0 transition-colors duration-300">
                  <MapPin className="text-orange-600 group-hover:text-fuchsia-500 transition-colors duration-300" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-orange-900 group-hover:text-fuchsia-600 transition-colors duration-300">
                    {grupo.split(' - ')[0].toUpperCase()} <span className="font-normal opacity-80 text-xl">- {grupo.split(' - ')[1]}</span>
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {turmas.map((turma) => (
                  <div key={turma.id} className="border border-orange-100 rounded-2xl overflow-hidden hover:border-orange-300 transition-colors">
                    <button 
                      onClick={() => {
                        if (turma.esgotada) {
                          setActiveAviseMe(activeAviseMe === turma.id ? null : turma.id);
                        } else {
                          const el = document.getElementById('investimento');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`w-full text-left flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 bg-white hover:bg-orange-50 transition-all duration-200 active:scale-[0.98] group/item ${turma.esgotada ? 'opacity-80' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <Clock className={turma.esgotada ? 'text-orange-400' : 'text-orange-600'} size={24} />
                        <span className={`text-xl font-bold ${turma.esgotada ? 'text-orange-400 line-through decoration-2' : 'text-orange-600'}`}>{turma.horario}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3">
                          <h4 className="text-xl font-bold text-orange-900 group-hover/item:text-orange-600 transition-colors">{turma.ritmo}</h4>
                          {turma.esgotada ? (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Esgotada</span>
                          ) : (
                            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.6)]"></span>
                              Abertas
                            </span>
                          )}
                        </div>
                        <p className="text-orange-700">{turma.nivel}</p>
                      </div>
                      
                      <div className="shrink-0">
                        {turma.esgotada ? (
                          <div className="flex items-center gap-2 text-fuchsia-600 font-bold bg-fuchsia-50 px-3 py-1.5 rounded-lg border border-fuchsia-200 group-hover/item:bg-fuchsia-100 transition-colors">
                            <Bell size={18} />
                            Avise-me
                          </div>
                        ) : (
                          <ArrowRight className="text-orange-300 group-hover/item:text-orange-600 transition-all group-hover/item:translate-x-2" size={24} />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {activeAviseMe === turma.id && turma.esgotada && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-orange-50/50 border-t border-orange-100"
                        >
                          <form onSubmit={(e) => handleAviseMe(e, turma.id)} className="p-6">
                            {success ? (
                              <div className="text-center text-green-600 font-medium py-3">
                                E-mail cadastrado com sucesso! Te avisaremos quando abrir nova vaga.
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  type="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Digite seu e-mail..."
                                  className="flex-1 px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400"
                                />
                                <button
                                  type="submit"
                                  disabled={submitting}
                                  className="bg-fuchsia-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-fuchsia-700 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                                >
                                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Me avise!'}
                                </button>
                              </div>
                            )}
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
