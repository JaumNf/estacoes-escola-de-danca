'use client';

import { useState, useEffect } from 'react';
import { Accessibility, Type, ZoomIn, ZoomOut, Moon, Sun, X, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Base font size
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    // Apply dyslexic font
    if (dyslexicFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [dyslexicFont]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  
  const resetAccessibility = () => {
    setFontSize(16);
    setHighContrast(false);
    setDyslexicFont(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 lg:bottom-32 right-6 lg:right-10 z-40 p-4 rounded-full bg-orange-100 text-orange-900 border-2 border-orange-300 shadow-lg hover:bg-orange-200 hover:scale-105 transition-all outline-none focus:ring-4 focus:ring-orange-400"
        aria-label="Menu de Acessibilidade"
      >
        <Accessibility size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-48 lg:bottom-52 right-6 lg:right-10 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden"
          >
            <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Accessibility size={18} />
                Acessibilidade
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-orange-500 rounded-md transition-colors"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Tamanho da Fonte */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Tamanho do Texto</p>
                <div className="flex gap-2">
                  <button 
                    onClick={decreaseFontSize}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-orange-50 text-orange-900 rounded-lg hover:bg-orange-100 border border-orange-200"
                    aria-label="Diminuir texto"
                  >
                    <ZoomOut size={16} /> A-
                  </button>
                  <button 
                    onClick={increaseFontSize}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-orange-50 text-orange-900 rounded-lg hover:bg-orange-100 border border-orange-200"
                    aria-label="Aumentar texto"
                  >
                    <ZoomIn size={16} /> A+
                  </button>
                </div>
              </div>

              {/* Contraste */}
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  highContrast 
                    ? 'border-orange-600 bg-orange-600 text-white' 
                    : 'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  {highContrast ? <Sun size={18} /> : <Moon size={18} />}
                  Alto Contraste
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-orange-400' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full transition-all ${highContrast ? 'left-[22px]' : 'left-1'}`} />
                </div>
              </button>

              {/* Fonte Disléxica */}
              <button 
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  dyslexicFont 
                    ? 'border-orange-600 bg-orange-600 text-white' 
                    : 'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <Type size={18} />
                  Fonte para Dislexia
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${dyslexicFont ? 'bg-orange-400' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full transition-all ${dyslexicFont ? 'left-[22px]' : 'left-1'}`} />
                </div>
              </button>

              <button 
                onClick={resetAccessibility}
                className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors py-2 font-medium"
              >
                <RefreshCcw size={14} /> Restaurar Padrões
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
