'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export default function Tooltip({ children, content, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)} // For mobile support
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-brown-800 text-brown-50 text-xs rounded-xl shadow-xl z-50 border border-brown-700 min-w-[200px] text-center pointer-events-none"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brown-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
