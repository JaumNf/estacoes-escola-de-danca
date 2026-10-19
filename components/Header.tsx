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
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,box-shadow,backdrop-filter,padding] duration-240 ${
          isScrolled ? 'bg-brown-50/80 backdrop-blur-lg shadow-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-3 font-display font-bold text-2xl tracking-wider ${isScrolled ? 'text-brown-950' : 'text-brown-50'}`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-current">
              <Image 
                src="/images/header-logo-estacoes.webp" 
                alt="Logo Estações" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover"
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
              className={`pressable-sm flex items-center justify-center rounded-full p-2 hover:bg-black/10 ${isScrolled ? 'text-[#25D366]' : 'text-[#25D366] bg-white/10'}`}
              aria-label="Comunidade WhatsApp"
              title="Entrar na Comunidade WhatsApp"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            <button 
              className={`pressable lg:hidden z-50 relative ${isMobileMenuOpen ? 'text-brown-950' : (isScrolled ? 'text-brown-950' : 'text-brown-50')}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <button 
              className={`pressable hidden lg:flex z-50 relative ${isMobileMenuOpen ? 'text-brown-950' : (isScrolled ? 'text-brown-950' : 'text-brown-50')}`}
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
                        className="pressable-lg group flex items-center justify-between text-xl font-display font-medium text-brown-800 hover:text-terracotta py-4 px-4 rounded-xl hover:bg-brown-100/50"
                      >
                        <span className="group-hover:translate-x-2 transition-transform">{item.label}</span>
                        <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,translate] duration-160 text-terracotta">→</span>
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
