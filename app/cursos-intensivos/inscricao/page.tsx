import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EdicaoEmBreve from '@/components/EdicaoEmBreve';
import InscricaoForm from '../InscricaoForm';
import { AULAS, EDICAO, calcularOrcamento, formatarReais, loteAtivo } from '@/lib/intensivo';

/**
 * Página só da inscrição, para mandar o link direto no WhatsApp, no Instagram
 * e na bio — sem a pessoa ter que achar o formulário no meio da página do
 * curso. É o mesmo componente de /cursos-intensivos#matricula: muda só a
 * moldura, então não há dois formulários para manter.
 *
 * É Server Component de propósito: só assim dá para exportar `metadata`, que é
 * o que faz o link aparecer com título, descrição e imagem quando alguém
 * compartilha. O formulário continua sendo client, importado aqui dentro.
 */

const TUDO = AULAS.filter((aula) => !aula.intervalo).map((aula) => aula.id);
const PRECO_CHEIO = calcularOrcamento(TUDO, 'individual').total;

const TITULO = EDICAO.ativa
  ? `Inscrição — ${EDICAO.nome} | Estações Escola de Dança`
  : 'Inscrição nos Cursos Intensivos | Estações Escola de Dança';

const DESCRICAO = EDICAO.ativa
  ? `${EDICAO.periodo}, no Teatro do Mundo, em Campo Grande. Aulas do zero a partir de ${formatarReais(
      loteAtivo().porAula,
    )} — ou tudo, com o baile incluso, por ${formatarReais(PRECO_CHEIO)}. Garanta sua vaga pelo PIX.`
  : 'As inscrições do próximo curso intensivo ainda não abriram. Entre na comunidade e seja avisado primeiro.';

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: '/cursos-intensivos/inscricao' },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    url: '/cursos-intensivos/inscricao',
    siteName: 'Estações Escola de Dança',
    images: [
      {
        url: '/og.jpg',
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
    title: TITULO,
    description: DESCRICAO,
    images: ['/og.jpg'],
  },
};

export default function InscricaoPage() {
  return (
    <main className="min-h-screen bg-[#3d1c04]">
      <Header />

      <section className="px-6 pt-28 pb-10 md:pt-32 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/cursos-intensivos"
            className="pressable inline-flex items-center gap-2 text-orange-200 hover:text-[#fbbf24] font-semibold mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-120" />
            Ver tudo sobre o curso
          </Link>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-orange-50 leading-tight">
            {EDICAO.ativa ? `Inscrição · ${EDICAO.nome}` : 'Cursos Intensivos'}
          </h1>

          {EDICAO.ativa && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-orange-200">
              <span className="inline-flex items-center gap-2">
                <Calendar size={17} className="text-[#fbbf24] shrink-0" aria-hidden />
                <span className="font-medium">{EDICAO.periodo}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-[#fbbf24] shrink-0" aria-hidden />
                <span className="font-medium">{EDICAO.local}</span>
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="w-full bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm">
            {EDICAO.ativa ? (
              <InscricaoForm />
            ) : (
              <EdicaoEmBreve
                titulo="Novas edições em breve!"
                descricao="As inscrições do próximo curso intensivo ainda não abriram. Entre na nossa comunidade no WhatsApp e seja a primeira pessoa a saber quando as vagas forem liberadas."
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
