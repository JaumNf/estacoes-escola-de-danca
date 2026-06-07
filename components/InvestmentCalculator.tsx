'use client';

import { useState } from 'react';
import { User, Users, GraduationCap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const TURMAS = [
  { id: 'v_u1', nome: 'Vanera e Chamamé', unidade: 'Teatro do Mundo' },
  { id: 'f_u1', nome: 'Forró', unidade: 'Teatro do Mundo' },
  { id: 'b_u1', nome: 'Bachata', unidade: 'Teatro do Mundo' },
  { id: 'd_u2', nome: 'Dança de Salão', unidade: 'Templo Nambei' },
  { id: 'f_u2', nome: 'Forró', unidade: 'Templo Nambei' },
];

export default function InvestmentCalculator() {
  const [isUniversitario, setIsUniversitario] = useState(false);
  const [type, setType] = useState<'individual' | 'dupla'>('individual');
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);

  const toggleTurma = (id: string) => {
    setSelectedTurmas(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const getBasePrice = () => {
    if (isUniversitario) {
      return type === 'individual' ? 100 : 150;
    }
    return type === 'individual' ? 120 : 180;
  };

  const basePrice = getBasePrice();
  const additionalPrice = basePrice / 2;

  const calculateTotal = () => {
    if (selectedTurmas.length === 0) return 0;
    return basePrice + (selectedTurmas.length - 1) * additionalPrice;
  };

  const calculateDiscountInfo = () => {
    if (selectedTurmas.length <= 1) return null;
    return (selectedTurmas.length - 1) * additionalPrice;
  };

  return (
    <div className="bg-[#1e0a05] rounded-3xl p-6 md:p-10 border border-orange-900/50 shadow-2xl w-full max-w-4xl mx-auto text-orange-50 font-sans">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-orange-400 mb-2">Simule seu Plano</h3>
        <p className="text-orange-200 text-lg">Descubra o valor ideal para sua rotina na dança.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-orange-300">1. Qual o seu perfil?</h4>
            <div className="flex bg-black/40 rounded-xl p-1 border border-orange-900/30">
              <button 
                onClick={() => setIsUniversitario(false)}
                className={`flex-1 py-3 text-sm font-bold tracking-wide rounded-lg transition-all ${!isUniversitario ? 'bg-orange-600 text-white shadow-md' : 'text-orange-400 hover:text-orange-200'}`}
              >
                Público Geral
              </button>
              <button 
                onClick={() => setIsUniversitario(true)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold tracking-wide rounded-lg transition-all ${isUniversitario ? 'bg-orange-600 text-white shadow-md' : 'text-orange-400 hover:text-orange-200'}`}
              >
                <GraduationCap size={18} /> Universitário
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-orange-300">2. Como deseja se matricular?</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setType('individual')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 ${type === 'individual' ? 'border-orange-500 bg-orange-900/40 text-orange-50' : 'border-orange-900/50 hover:border-orange-700/50 text-orange-400'}`}
              >
                <User size={28} className={type === 'individual' ? 'text-orange-400 mb-2' : 'mb-2 opacity-70'} />
                <span className="font-bold">Individual</span>
              </button>
              <button 
                onClick={() => setType('dupla')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 ${type === 'dupla' ? 'border-orange-500 bg-orange-900/40 text-orange-50' : 'border-orange-900/50 hover:border-orange-700/50 text-orange-400'}`}
              >
                <Users size={28} className={type === 'dupla' ? 'text-orange-400 mb-2' : 'mb-2 opacity-70'} />
                <span className="font-bold">Em Dupla</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-bold text-orange-300">3. Selecione as turmas desejadas:</h4>
            <div className="space-y-2">
              {TURMAS.map((turma) => {
                const isSelected = selectedTurmas.includes(turma.id);
                return (
                  <button
                    key={turma.id}
                    onClick={() => toggleTurma(turma.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${isSelected ? 'bg-orange-800/40 border-orange-500' : 'bg-black/20 border-orange-900/30 hover:border-orange-700 hover:bg-black/40'}`}
                  >
                    <div>
                      <div className={`font-bold ${isSelected ? 'text-orange-100' : 'text-orange-300'}`}>{turma.nome}</div>
                      <div className="text-xs text-orange-500/80 mt-1">{turma.unidade}</div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="text-orange-500" size={24} />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-orange-800/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sticky top-6 self-start bg-gradient-to-b from-orange-900/60 to-black/60 border border-orange-800/60 rounded-3xl p-6 md:p-8">
          <h4 className="text-xl font-bold text-orange-100 mb-6 border-b border-orange-800/50 pb-4">Resumo do Investimento</h4>
          
          {selectedTurmas.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center opacity-60 min-h-[200px]">
              <CheckCircle2 size={40} className="mb-4 text-orange-800" />
              <p>Selecione ao menos uma turma para visualizar os valores.</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between text-orange-200">
                  <span>Plano Base ({type === 'individual' ? 'Individual' : 'Dupla'})</span>
                  <span className="font-mono">R$ {basePrice.toFixed(2).replace('.', ',')}</span>
                </div>
                
                {selectedTurmas.length > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-fuchsia-400 text-sm font-medium"
                  >
                    <span>+ {selectedTurmas.length - 1} turma(s) adicionais (50% OFF)</span>
                    <span className="font-mono">+ R$ {((selectedTurmas.length - 1) * additionalPrice).toFixed(2).replace('.', ',')}</span>
                  </motion.div>
                )}
              </div>

              <div className="border-t border-orange-800/60 pt-6 mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg text-orange-100">Mensalidade Total</span>
                  <span className="text-4xl font-display font-bold text-orange-400">
                    R$ {calculateTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {selectedTurmas.length > 1 && (
                  <div className="bg-fuchsia-900/30 text-fuchsia-300 text-sm px-3 py-2 rounded-lg font-medium text-center border border-fuchsia-800/50">
                    Sua economia mensal: R$ {calculateDiscountInfo()?.toFixed(2).replace('.', ',')} 🚀
                  </div>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={() => { const el = document.getElementById('matricula'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            disabled={selectedTurmas.length === 0}
            className={`w-full py-4 mt-8 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center ${selectedTurmas.length > 0 ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-xl shadow-orange-900/20' : 'bg-orange-900/20 text-orange-700 cursor-not-allowed'}`}
          >
            Quero me matricular
          </button>
        </div>
      </div>
    </div>
  );
}
