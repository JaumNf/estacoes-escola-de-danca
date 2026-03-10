import type {Metadata} from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css'; // Global styles

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
  title: 'Estações | Estúdio de Dança',
  description: 'Descubra a arte da dança em nosso estúdio. Aulas regulares, cursos intensivos e bailes.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="antialiased selection:bg-brown-300 selection:text-brown-950">
        {children}
      </body>
    </html>
  );
}
