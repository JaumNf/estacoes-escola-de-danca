import type { Metadata } from 'next';

import BaileConteudo from './BaileConteudo';
import { BAILE } from '@/lib/baile';
import { formatarReais } from '@/lib/comum';

/**
 * Casca de servidor da página do baile.
 *
 * Existe só para exportar `metadata`: é o que faz o link aparecer com título,
 * descrição e imagem quando alguém manda a página no WhatsApp ou no Instagram —
 * que é como a maior parte do público chega. O corpo continua sendo client
 * component, em `BaileConteudo.tsx`, por causa das animações.
 *
 * Até 20/10/2026 esta rota era um único `'use client'`, e por isso não tinha
 * metadata nenhuma: o link saía cru.
 */

const TITULO = BAILE.ativo
  ? `${BAILE.nome} — ${BAILE.periodo} | Estações Escola de Dança`
  : 'Bailes | Estações Escola de Dança';

const DESCRICAO = BAILE.ativo
  ? `${BAILE.periodo}, ${BAILE.horario}, no Teatro do Mundo, em Campo Grande. Ingresso antecipado por ${formatarReais(
      BAILE.antecipado,
    )} — ${formatarReais(BAILE.naHora)} na portaria. Não precisa levar par.`
  : 'Nossos bailes acontecem em edições especiais ao longo do ano. Entre na comunidade e seja avisado da próxima data.';

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: '/baile' },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    url: '/baile',
    siteName: 'Estações Escola de Dança',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function BailePage() {
  return <BaileConteudo />;
}
