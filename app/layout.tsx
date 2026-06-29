import type {Metadata} from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Global styles
import CookieBanner from '@/components/CookieBanner';
import Chatbot from '@/components/Chatbot';
import BackToTop from '@/components/BackToTop';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Estações Escola de Dança | Dança com Alegria e Sem Neura',
  description: 'Descubra a arte da dança a dois em Campo Grande. Mais que técnica, um espaço para se divertir, conhecer pessoas e viver melhor. Vem dançar!',
  metadataBase: new URL('https://escoladedancaestacoes.vercel.app/'),
  manifest: '/manifest.json',
  openGraph: {
    title: 'Estações Escola de Dança | Vem dançar em Campo Grande/MS!',
    description: 'Aprenda Forró, Vanera, Chamamé e mais em um ambiente sem julgamentos. Dança a dois para se divertir, fazer novos amigos e relaxar. Clique e junte-se a nós!',
    url: 'https://escoladedancaestacoes.vercel.app/',
    siteName: 'Estações Escola de Dança',
    images: [
      {
        url: 'https://escoladedancaestacoes.vercel.app/URL_DA_SUA_IMAGEM.jpg', // TODO: SUBSTITUIR PELO LINK DA SUA IMAGEM
        width: 1200,
        height: 630,
        alt: 'Turma animada dançando na Estações Escola de Dança',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Estações Escola de Dança | Vem dançar em Campo Grande/MS!',
    description: 'Aprenda Forró, Vanera, Chamamé e mais em um ambiente sem julgamentos. Dança a dois para se divertir, fazer novos amigos e relaxar.',
    images: ['https://escoladedancaestacoes.vercel.app/URL_DA_SUA_IMAGEM.jpg'], // TODO: SUBSTITUIR PELO LINK DA SUA IMAGEM
  },
  verification: {
    google: 'FzN2VszccJtpegzgYnqaZxplGVnzROU3O1gbqC1akdU',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BPFGLVKRPL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BPFGLVKRPL');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-brown-300 selection:text-brown-950">
        {children}
        <CookieBanner />
        <Chatbot />
        <BackToTop />
        <Script id="service-worker-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
