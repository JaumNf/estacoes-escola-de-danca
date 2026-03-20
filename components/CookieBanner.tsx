'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-brown-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <div className="text-brown-800 text-sm md:text-base text-center md:text-left flex-1">
              <p>
                Utilizamos cookies para melhorar sua experiência em nosso site, personalizar conteúdo e analisar nosso tráfego. 
                Ao continuar navegando, você concorda com a nossa{' '}
                <Link href="/politica-de-privacidade" className="text-terracotta hover:text-brown-900 font-bold underline underline-offset-2 transition-colors">
                  Política de Privacidade
                </Link>.
              </p>
            </div>
            <div className="flex shrink-0 w-full md:w-auto">
              <button
                onClick={acceptCookies}
                className="w-full md:w-auto px-8 py-3 bg-terracotta text-white font-medium rounded-full hover:bg-brown-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
              >
                Aceitar e Fechar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
