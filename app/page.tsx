'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import WaveDivider from '@/components/WaveDivider';
import FeedbackSection from '@/components/FeedbackSection';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

import EssenceCard from '@/components/EssenceCard';

export default function Home() {
  const [showToast, setShowToast] = useState(false);

  const handleCursosIntensivosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <main className="min-h-screen bg-brown-50 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-medium tracking-wide flex items-center gap-2"
          >
            <span className="text-xl">🚧</span>
            Em breve!
          </motion.div>
        )}
      </AnimatePresence>
      <Header />
      <HeroCarousel />

      {/* About Section */}
      <motion.section 
        id="sobre" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative py-16 md:py-24 px-6 bg-brown-50"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brown-900 leading-tight">
              Todo mundo nasceu para dançar.
            </h2>
            <p className="text-base md:text-lg text-brown-800 leading-relaxed">
              Mais do que passos, ensinamos você a se movimentar com confiança. Trabalhamos ritmos como forró, vanera, chamamé, samba e salsa, desde a base até movimentos que fazem sentido no corpo. Nossa proposta é que você saia se sentindo capaz, leve e com vontade de continuar dançando.
            </p>
            <p className="text-base md:text-lg text-brown-800 leading-relaxed">
              Nosso espaço é pensado para acolher. Começamos do zero para quem nunca dançou e evoluímos para desafios que estimulam quem já tem experiência. Nossa metodologia torna o aprendizado fácil e prazeroso, respeitando o seu tempo.
            </p>
            
            <div className="pt-2">
              <p className="text-brown-900 font-bold text-base mb-2">
                Ficou interessado? Agende sua aula para aprender com a gente.
              </p>
              <a 
                href="https://wa.me/5567992630948?text=Gostaria%20de%20conhecer%20como%20funcionamos%2C%20agende%20sua%20aula%20experimental"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brown-900 text-brown-50 px-6 py-3 rounded-full font-medium tracking-wide hover:bg-terracotta transition-colors duration-300 shadow-lg shadow-brown-900/20"
              >
                Agende sua aula experimental
              </a>
            </div>
          </div>
          <div className="relative h-[350px] md:h-[500px] w-full">
            <div className="absolute inset-0 bg-ochre/20 rounded-[40px] rounded-tr-none transform translate-x-4 translate-y-4"></div>
            <Image
              src="https://drive.google.com/uc?export=view&id=1s4pxsblj1XCqcLd02lJN4yuXz4zNRlop"
              alt="Sobre nós"
              fill
              className="object-cover rounded-[40px] rounded-tl-none shadow-xl"
              referrerPolicy="no-referrer"
              unoptimized
            />
          </div>
        </div>
      </motion.section>

      {/* 3 Cards Section */}
      <motion.section 
        id="aulas" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-brown-100 px-6"
      >
        <WaveDivider position="top" colorClass="fill-brown-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-4">Nossa Essência</h2>
            <p className="text-brown-700 max-w-2xl mx-auto text-base md:text-lg">Nossa metodologia para um aprendizado natural e divertido.</p>
            <p className="text-terracotta text-xs mt-3 font-bold uppercase tracking-widest animate-pulse">Clique nos cards abaixo para saber mais</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Acolhimento',
                desc: 'Aqui ninguém fica de fora. Quem está começando encontra segurança e base, e quem já dança encontra desafios. O foco é a vontade de estar ali.',
                icon: '🌿'
              },
              {
                title: 'Prática e Fluidez',
                desc: 'Menos tempo parado e mais tempo em movimento. Um ambiente leve e uma dinâmica que faz a aula fluir, tornando o aprendizado natural.',
                icon: '🔥'
              },
              {
                title: 'Conexão e Diversão',
                desc: 'Além da dança, criamos encontros. Nos preocupamos em enturmar os alunos, fazendo com que todos participem e se sintam à vontade.',
                icon: '🤝'
              }
            ].map((card, idx) => (
              <EssenceCard key={idx} {...card} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Works Section */}
      <motion.section 
        id="trabalhos" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-brown-50"
      >
        <WaveDivider position="top" colorClass="fill-brown-100" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brown-900 mb-4">Nossos Trabalhos</h2>
            <div className="w-16 h-1 bg-terracotta mx-auto rounded-full mb-4"></div>
            <p className="text-brown-700 max-w-2xl mx-auto text-base md:text-lg">Selecione algum que você teria mais interesse...</p>
            <p className="text-terracotta text-xs mt-3 font-bold uppercase tracking-widest animate-pulse">Clique nas imagens para ver detalhes</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Bailes', img: 'https://lh3.googleusercontent.com/d/1T5ZAhkOeGQZqnJv-at2WV4kCQLHdifJW', href: '/baile' },
            { title: 'Aulas Regulares', img: 'https://lh3.googleusercontent.com/d/1jJqHjC6tiWATMhA7zrZM4IUlxd3p7xGC', href: '/aulas-regulares' },
            { title: 'Cursos intensivos', img: 'https://lh3.googleusercontent.com/d/1URzYQjUA6RL0bn783UvqPyQ2txodm-kB', href: '#' }
          ].map((work, idx) => (
            <Link 
              key={idx}
              href={work.href}
              onClick={work.title === 'Cursos intensivos' ? handleCursosIntensivosClick : undefined}
              className="group relative h-[300px] md:h-[400px] rounded-[32px] overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:-translate-y-2 block"
            >
              <Image
                src={work.img}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-900/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-brown-50 mb-2">{work.title}</h3>
                <div className="w-12 h-1 bg-ochre rounded-full mb-3"></div>
                <p className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                  Saiba mais <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </motion.section>

      {/* Feedbacks Section */}
      <FeedbackSection />

      {/* Locations Section */}
      <motion.section 
        id="unidades" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-brown-900 text-brown-50 px-6 overflow-hidden"
      >
        <WaveDivider position="top" colorClass="fill-brown-50" />
        {/* Decorative organic shape */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brown-800/40 rounded-organic-1 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-terracotta/10 rounded-organic-2 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">Nossas Unidades</h2>
            <p className="text-brown-200 text-base md:text-lg max-w-2xl mx-auto mb-3">Encontre o espaço mais próximo de você e venha nos fazer uma visita.</p>
            <p className="text-terracotta text-xs md:text-sm max-w-2xl mx-auto italic">* Os endereços abaixo são espaços parceiros que utilizamos para a realização das nossas aulas e cursos.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Unidade 1 - Centro',
                address: 'R. Barão de Melgaço, 177 - Centro, Campo Grande - MS, 79002-090',
                mapLink: 'https://maps.app.goo.gl/vXB9ezPd49HmbC9eA',
                phone: '(67) 99263-0948',
                whatsappLink: 'https://wa.me/5567992630948',
                email: 'cursodeverao67@gmail.com',
                img: 'https://drive.google.com/uc?export=view&id=1-G5rU0kTPGyQe8wOwArb756R9FX_17rc'
              },
              {
                name: 'Unidade 2 - Oeste',
                address: 'R. Carvalho, 319 - Cidade Jardim, Campo Grande - MS, 79040-660',
                mapLink: 'https://maps.app.goo.gl/dtnrdk3MXYSwZsdc8',
                phone: '(67) 99263-0948',
                whatsappLink: 'https://wa.me/5567992630948',
                email: 'cursodeverao67@gmail.com',
                img: 'https://drive.google.com/uc?export=view&id=1tj8o79FcqiMRoIdZfr1hKlLSobPCyhkK'
              }
            ].map((unit, idx) => (
              <div key={idx} className="bg-brown-950/60 rounded-[32px] overflow-hidden border border-brown-800/50 backdrop-blur-sm hover:border-brown-700 transition-colors">
                <a href={unit.mapLink} target="_blank" rel="noopener noreferrer" className="relative h-56 w-full block cursor-pointer">
                  <Image
                    src={unit.img}
                    alt={unit.name}
                    fill
                    className="object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal hover:opacity-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                </a>
                <div className="p-6 md:p-8 space-y-4">
                  <h3 className="text-2xl font-display font-bold text-ochre">{unit.name}</h3>
                  <div className="space-y-3 text-brown-200 text-base">
                    <a href={unit.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group/link">
                      <MapPin size={20} className="text-terracotta group-hover/link:text-ochre transition-colors shrink-0" /> 
                      <span>{unit.address}</span>
                    </a>
                    <a href={unit.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group/link">
                      <Phone size={20} className="text-terracotta group-hover/link:text-ochre transition-colors shrink-0" /> 
                      <span>{unit.phone}</span>
                    </a>
                    <a href={`mailto:${unit.email}`} className="flex items-center gap-3 hover:text-white transition-colors group/link">
                      <Mail size={20} className="text-terracotta group-hover/link:text-ochre transition-colors shrink-0" /> 
                      <span>{unit.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Partners Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative pt-24 pb-16 md:pt-32 md:pb-16 px-6 bg-brown-50"
      >
        <WaveDivider position="top" colorClass="fill-brown-900" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h4 className="text-xs font-bold tracking-widest uppercase text-brown-500 mb-8">Nossos Parceiros</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { name: 'Estação Cultural Teatro do Mundo', img: 'https://drive.google.com/uc?export=view&id=1sT2v-sCt4aSmqeCOn4rVYRt0nrHbOz2a', link: 'https://www.instagram.com/estacaoculturalteatrodomundo' },
              { name: 'Movimentaê', img: 'https://lh3.googleusercontent.com/d/1lh0BSQXlSaA4I6c9RnT1OjGdHBWKHH6w', link: 'https://www.instagram.com/movimentae.ms' },
              { name: 'Projeto Guardião Azul', img: 'https://drive.google.com/uc?export=view&id=1zvIs2-AlTr2jyuil27fq8UH-AoRYI7wu', link: 'https://www.instagram.com/guardiaoazulms' },
              { name: 'Nambei Honganji', img: 'https://drive.google.com/uc?export=view&id=10rzNw6aAw5E6fQrov-gQEdRJZlbRtKFO', link: 'https://www.instagram.com/nambeihonganjicgr' }
            ].map((partner, idx) => (
              <a 
                key={idx} 
                href={partner.link}
                target={partner.link !== '#' ? "_blank" : undefined}
                rel={partner.link !== '#' ? "noopener noreferrer" : undefined}
                className="flex flex-col items-center gap-3 group cursor-pointer w-28 md:w-40"
              >
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-brown-200 group-hover:border-terracotta transition-colors duration-300 shadow-sm group-hover:shadow-md shrink-0">
                  <Image
                    src={partner.img}
                    alt={partner.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                </div>
                <span className="font-display text-base font-medium text-brown-700 group-hover:text-brown-900 transition-colors text-center leading-tight">
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
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
              <li><a href="#sobre" className="hover:text-terracotta transition-colors">Sobre Nós</a></li>
              <li><a href="#aulas" className="hover:text-terracotta transition-colors">Nossas Aulas</a></li>
              <li><a href="#trabalhos" className="hover:text-terracotta transition-colors">Trabalhos</a></li>
              <li><a href="#unidades" className="hover:text-terracotta transition-colors">Unidades</a></li>
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
              <li>Seg - Sex: 08h às 22h</li>
              <li>Sáb: 09h às 14h</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-brown-800 flex flex-col md:flex-row items-center justify-between gap-4 text-brown-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Escola de Dança Estações. Todos os direitos reservados.</p>
          <Link href="/politica-de-privacidade" className="hover:text-terracotta transition-colors underline underline-offset-2">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </main>
  );
}
