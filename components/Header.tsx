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
    if (label === 'Cursos intensivos') {
      e.preventDefault();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Sobre nós', href: '/#sobre' },
    { label: 'Aulas regulares', href: '/aulas-regulares' },
    { label: 'Cursos intensivos', href: '/#trabalhos' },
    { label: 'Baile', href: '/baile' },
    { label: 'Endereço', href: '/#unidades' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-brown-50/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
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

          <div className="flex items-center justify-end gap-6">
            <a 
              href="https://www.instagram.com/cursodeverao67" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300`}
              aria-label="Instagram"
            >
              <Instagram size={20} />
              <span className="text-sm font-medium tracking-wide hidden xl:block">@cursodeverao67</span>
            </a>
            <button 
              className={`lg:hidden z-50 relative ${isMobileMenuOpen ? 'text-brown-950' : (isScrolled ? 'text-brown-950' : 'text-brown-50')}`}
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
                  <a 
                    href="https://www.instagram.com/cursodeverao67" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group bg-white/50 p-4 rounded-2xl border border-brown-100 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <Instagram size={24} className="text-brown-900" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-brown-900 text-lg leading-none mb-1 group-hover:text-terracotta transition-colors">Escola de Dança Estações</span>
                      <span className="text-brown-500 text-sm font-medium">@cursodeverao67</span>
                    </div>
                  </a>
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
                  <p className="text-brown-400 text-xs font-medium">© {new Date().getFullYear()} Escola de Dança Estações</p>
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
