import type {Metadata} from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Global styles
import CookieBanner from '@/components/CookieBanner';
import Chatbot from '@/components/Chatbot';

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
  title: 'Escola de Dança Estações',
  description: 'Descubra a arte da dança na Escola de Dança Estações. Aulas regulares, cursos intensivos e bailes.',
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
      </body>
    </html>
  );
}
