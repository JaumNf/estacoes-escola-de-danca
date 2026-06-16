'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EssenceCardProps {
  title: string;
  desc: string;
  icon: string;
}

export default function EssenceCard({ title, desc, icon }: EssenceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-brown-50 p-8 rounded-[32px] shadow-sm border border-brown-200/50 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col items-center text-center relative overflow-hidden ${isOpen ? 'ring-2 ring-terracotta/50' : ''}`}
    >
      <div className="flex-1 flex flex-col items-center w-full">
        <div className={`text-4xl mb-6 bg-brown-100 w-20 h-20 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-terracotta text-white' : 'group-hover:bg-terracotta/10'}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-display font-bold text-brown-900 mb-2">{title}</h3>
      </div>
      
      <div className="w-full mt-4">
        {!isOpen && (
            <p className="text-xs text-terracotta uppercase tracking-widest font-bold mt-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse"></span>
              Clique para ver mais
            </p>
        )}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-brown-700 leading-relaxed text-lg pt-4 border-t border-brown-100 mt-4">{desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
