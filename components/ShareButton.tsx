'use client';

import { useState, useEffect } from 'react';
import { Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: 'Confira a Escola de Dança Estações!',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleShare}
        className="flex items-center justify-center w-14 h-14 bg-terracotta text-white rounded-full shadow-lg hover:bg-brown-800 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-terracotta/30"
        aria-label="Compartilhar página"
      >
        {copied ? <Check size={24} /> : <Share2 size={24} />}
      </button>
      
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-brown-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xl"
          >
            Link copiado!
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-brown-900 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
