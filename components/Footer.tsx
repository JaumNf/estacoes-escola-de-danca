import React from 'react';
import WaveDivider from './WaveDivider';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-brown-950 pt-24 pb-12 md:pt-32 md:pb-16 px-6">
      <WaveDivider position="top" colorClass="fill-brown-50" />
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 relative z-10">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="font-display font-bold text-3xl text-ochre">ESTAÇÕES</div>
          <p className="text-brown-200 max-w-md text-base leading-relaxed">
            Nossa proposta é mostrar que todo mundo pode dançar. Venha desenvolver sua consciência corporal, musicalidade e o prazer em dançar em um ambiente acolhedor.
          </p>
          <div className="flex gap-3">
            <a href="https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center text-brown-100 hover:bg-terracotta hover:text-white transition-colors animate-pulse hover:animate-none shadow-[0_0_15px_rgba(217,119,87,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-display font-bold text-xl text-ochre mb-4">Links Rápidos</h4>
          <ul className="space-y-3 text-brown-200 text-base">
            <li><Link href="/#sobre" className="hover:text-terracotta transition-colors">Sobre Nós</Link></li>
            <li><Link href="/#aulas" className="hover:text-terracotta transition-colors">Nossas Aulas</Link></li>
            <li><Link href="/cursos-intensivos" className="hover:text-terracotta transition-colors">Cursos Intensivos</Link></li>
            <li><Link href="/#trabalhos" className="hover:text-terracotta transition-colors">Trabalhos</Link></li>
            <li><Link href="/#unidades" className="hover:text-terracotta transition-colors">Unidades</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-xl text-ochre mb-4">Contato</h4>
          <ul className="space-y-3 text-brown-200 text-base">
            <li>
              <a href="mailto:cursodeverao67@gmail.com" className="hover:text-terracotta transition-colors">
                cursodeverao67@gmail.com
              </a>
            </li>
            <li>
              <a href="https://wa.me/5567992630948" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta transition-colors">
                (67) 99263-0948
              </a>
            </li>
            <li className="pt-2">
              <span className="block font-bold">Unidade 1</span>
              <span className="opacity-80">R. Barão de Melgaço 177 - Centro</span>
            </li>
            <li className="pt-2">
              <span className="block font-bold">Unidade 2</span>
              <span className="opacity-80">R. Carvalho, 319 - Cidade Jardim</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brown-800/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-brown-300 text-sm">
          &copy; {new Date().getFullYear()} Escola de Dança Estações. Todos os direitos reservados.
        </p>
        <Link href="/politica-de-privacidade" className="text-brown-300 text-sm hover:text-terracotta transition-colors underline underline-offset-2">
          Política de Privacidade
        </Link>
      </div>
    </footer>
  );
}
