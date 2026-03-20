'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Copy, Video, ArrowRight } from 'lucide-react';

const feedItems = [
  {
    id: 'DU_W5fvkU_M',
    link: 'https://www.instagram.com/cursodeverao67/p/DU_W5fvkU_M/',
    // COLE AQUI O LINK DA IMAGEM 1 (Faça o upload da foto no Google Drive e cole o link direto aqui)
    image: 'https://picsum.photos/seed/dance1/800/1000', 
    type: 'carousel'
  },
  {
    id: 'DV1MUOrkcLH',
    link: 'https://www.instagram.com/cursodeverao67/reel/DV1MUOrkcLH/',
    // COLE AQUI O LINK DA IMAGEM 2
    image: 'https://picsum.photos/seed/dance2/800/1000',
    type: 'carousel'
  },
  {
    id: 'DTmEYHzjHG2',
    link: 'https://www.instagram.com/cursodeverao67/p/DTmEYHzjHG2/',
    // COLE AQUI O LINK DA IMAGEM 3
    image: 'https://picsum.photos/seed/dance3/800/1000',
    type: 'video'
  }
];

export default function InstagramFeed() {
  return (
    <section className="py-16 md:py-24 bg-[#FDFBF7]">
      {/* CTA Button */}
      <div className="max-w-7xl mx-auto text-center px-6 mb-24">
        <Link 
          href="/aulas-regulares"
          className="inline-flex items-center gap-3 px-8 py-5 bg-terracotta text-white rounded-full font-display font-bold text-xl md:text-2xl hover:bg-brown-900 transition-all duration-300 shadow-xl shadow-terracotta/20 hover:shadow-brown-900/20 hover:-translate-y-1 group"
        >
          <span>Quero fazer aulas regulares!</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto text-center px-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-brown-950 mb-4">
          Nosso Instagram
        </h2>
        <p className="text-brown-600 max-w-2xl mx-auto text-lg">
          Acompanhe nosso dia a dia, aulas e eventos através do nosso feed.
        </p>
      </div>
      
      {/* Container dos posts sem espaçamento */}
      <div className="w-full max-w-6xl mx-auto flex flex-row items-stretch justify-center">
        {feedItems.map((item) => (
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative w-1/3 aspect-[4/5] group overflow-hidden block bg-brown-100"
          >
            <Image
              src={item.image}
              alt="Instagram post"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Ícone no canto superior direito (Carrossel ou Vídeo) */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 drop-shadow-md">
              {item.type === 'carousel' ? (
                <Copy className="text-white drop-shadow-lg w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
              ) : (
                <Video className="text-white drop-shadow-lg w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
              )}
            </div>

            {/* Overlay escuro no hover com ícone do Instagram */}
            <div className="absolute inset-0 bg-brown-950/0 group-hover:bg-brown-950/40 transition-colors duration-300 flex items-center justify-center z-0">
              <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100" size={48} />
            </div>
          </a>
        ))}
      </div>

      <div className="text-center mt-12">
        <a 
          href="https://www.instagram.com/cursodeverao67" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brown-900 text-white rounded-full font-medium hover:bg-terracotta transition-colors shadow-lg shadow-brown-900/20"
        >
          <Instagram size={20} />
          <span>Siga @cursodeverao67</span>
        </a>
      </div>
    </section>
  );
}
