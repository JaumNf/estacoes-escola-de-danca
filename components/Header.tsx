'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent, label: string) => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Sobre nós', href: '/#sobre' },
    { label: 'Aulas regulares', href: '/aulas-regulares' },
    { label: 'Cursos intensivos', href: '/cursos-intensivos' },
    { label: 'Baile', href: '/baile' },
    { label: 'Endereço', href: '/#unidades' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-brown-50/80 backdrop-blur-lg shadow-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-3 font-display font-bold text-2xl tracking-wider ${isScrolled ? 'text-brown-950' : 'text-brown-50'}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-current">
              <Image 
                src="https://lh3.googleusercontent.com/d/1yyUUbZp4PQVHmec_yjwgk4MJmd2RcbVu" 
                alt="Logo Estações" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            </div>
            <span>ESTAÇÕES</span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.label)}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-terracotta ${
                  isScrolled ? 'text-brown-800' : 'text-brown-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 lg:gap-6">
            <a 
              href="https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center justify-center rounded-full p-2 hover:bg-black/10 transition-colors ${isScrolled ? 'text-[#25D366]' : 'text-[#25D366] bg-white/10'}`}
              aria-label="Comunidade WhatsApp"
              title="Entrar na Comunidade WhatsApp"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.996 0A12 12 0 0 0 0 12a11.96 11.96 0 0 0 1.602 6.015L0 24l6.15-1.614A11.96 11.96 0 0 0 11.996 24C18.625 24 24 18.625 24 12C24 5.375 18.625 0 11.996 0zm0 21.984c-1.896 0-3.774-.533-5.385-1.503l-.403-.244-4.041 1.059 1.077-3.921-.258-.415A9.97 9.97 0 0 1 1.996 12C1.996 6.48 6.476 2 11.996 2c5.52 0 10 4.48 10 10 0 5.52-4.48 10-10 10zm5.495-7.51c-.302-.15-1.785-.882-2.062-.983-.277-.1-.478-.15-.679.15-.201.301-.78 .983-.956 1.183-.176.201-.352.226-.654.075-2.083-1.04-3.567-2.613-4.225-3.754-.176-.301.176-.276.478-.882.1-.2.05-.376-.025-.526-.075-.15-.679-1.631-.93-2.233-.251-.577-.502-.679-.502h-.577c-.201 0-.528.075-.805.376-.277.301-1.056 1.03-1.056 2.51 0 1.48 1.082 2.91 1.233 3.111.15.2 2.122 3.238 5.14 4.542.718.31 1.278.496 1.713.635.72.23 1.378.197 1.895.12.576-.086 1.785-.728 2.036-1.433.251-.705.251-1.307.176-1.433-.075-.126-.277-.201-.578-.352z"/>
              </svg>
            </a>
            <button 
              className={`lg:hidden z-50 relative ${isMobileMenuOpen ? 'text-brown-950' : (isScrolled ? 'text-brown-950' : 'text-brown-50')}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <button 
              className={`hidden lg:flex z-50 relative ${isMobileMenuOpen ? 'text-brown-950' : (isScrolled ? 'text-brown-950' : 'text-brown-50')}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-brown-50 to-[#f3ece4] shadow-2xl z-50 lg:hidden flex flex-col overflow-y-auto border-l border-brown-200/50"
            >
              <div className="p-8 pt-24 flex flex-col h-full relative">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/5 rounded-bl-full pointer-events-none" />

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-10 pb-8 border-b border-brown-200/60 relative"
                >
                  <p className="text-terracotta text-xs mb-6 uppercase tracking-widest font-bold flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-terracotta"></span>
                    Acompanhe nosso trabalho
                  </p>
                </motion.div>

                <div className="flex flex-col gap-2 mb-auto relative z-10">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.08, type: 'spring', stiffness: 100 }}
                    >
                      <Link 
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.label)}
                        className="group flex items-center justify-between text-xl font-display font-medium text-brown-800 hover:text-terracotta transition-all duration-300 py-4 px-4 rounded-xl hover:bg-brown-100/50"
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300">{item.label}</span>
                        <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-terracotta">→</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 pt-8 border-t border-brown-200/60 text-center"
                >
                  <p className="text-brown-400 text-xs font-medium">© {new Date().getFullYear()} Estações Escola de Dança</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl z-[60] flex items-center gap-3"
          >
            <span className="text-xl">✨</span>
            <span className="font-medium">Aguarde as novidades!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
