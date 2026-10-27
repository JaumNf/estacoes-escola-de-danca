/**
 * Fonte única de verdade do baile.
 *
 * O baile é um produto da escola, não um item do curso intensivo. Ele tem data,
 * preço e venda próprios, e é vendido na página `/baile` — mesmo quando a
 * edição cai no mesmo fim de semana de um intensivo, como a de outubro de 2026.
 *
 * Tudo que muda de uma edição para a outra está neste arquivo. A página, o
 * formulário do ingresso e a rota `/api/baile` leem daqui: não há data nem
 * preço escrito em componente.
 *
 * ⚠️  Enquanto `BAILE.ativo` for false, a página mostra "novas edições em
 *     breve" e o formulário não é montado — ninguém consegue comprar ingresso
 *     para um baile sem data.
 *
 * Por que não importa de `lib/intensivo.ts`: a dependência corre no sentido
 * contrário. O intensivo importa o baile, para mostrá-lo no cronograma do
 * sábado e para dizer a quem fecha as quatro aulas que a entrada está inclusa.
 * O baile não precisa saber que o intensivo existe.
 */

import type { Formato } from '@/lib/comum';

export const BAILE = {
  /**
   * O interruptor geral. Com false, a página não vende e não promete data.
   * Ligue junto de conferir TODOS os campos abaixo — principalmente `comecaEm`,
   * que é o que fecha a venda antecipada na hora certa.
   */
  ativo: false,

  nome: 'Baile de Halloween',

  /** Aparece no hero, abaixo do título. Uma frase, sem ponto final duplo. */
  chamada: 'A noite que fecha o intensivo de outubro — e está aberta a todo mundo.',

  /** Como a data aparece escrita, por extenso. */
  periodo: 'Sábado, 24 de outubro',

  /** Para o cartão de data: o número e o mês abreviado em maiúsculas. */
  dia: '24',
  mes: 'OUT',
  diaSemana: 'Sábado',

  /** Ex.: '20:00 às 01:00'. É o que vai escrito na tela e na planilha. */
  horario: '20:00 às 01:00',

  /**
   * Início do baile, em ISO com fuso. É daqui que sai o prazo da venda
   * antecipada — errar o fuso aqui vende ingresso depois da porta fechar.
   */
  comecaEm: '2026-10-24T20:00:00-04:00',

  local: 'Teatro do Mundo — R. Barão de Melgaço, 177',
  cidade: 'Campo Grande, MS',

  /** Linha solta de ambiente. Deixe '' para esconder. */
  observacao: 'Fantasia é opcional, mas a gente sabe que você quer.',

  /**
   * O que a noite tem, além da pista. Cada item vira uma linha na página.
   * Vazio esconde a lista inteira.
   *
   * Estes vieram da arte oficial do baile, não de suposição: quem escrever uma
   * edição nova precisa confirmar com a escola antes de mudar.
   */
  atracoes: ['Baile de dança de salão', 'Dois ambientes', 'DJ Dadson e DJ Desproposito'],

  /**
   * O cartaz da edição.
   *
   * Serve a duas coisas, e a segunda é a que mais importa: além de aparecer na
   * página, é a imagem que o WhatsApp e o Instagram mostram quando alguém
   * manda o link. Sem ela o preview sai com a foto genérica do site.
   *
   * `alt` descreve a arte para quem não a enxerga. Os dados que estão escritos
   * DENTRO do cartaz — data, hora, preço, endereço — também aparecem em texto
   * na página, porque imagem não é lida, não é traduzida e não é selecionável.
   */
  arte: {
    src: '/images/baile-halloween-2026.webp',
    largura: 1122,
    altura: 1402,
    alt:
      'Cartaz do Baile de Halloween da Estações: Jason, Freddy Krueger e Michael Myers ' +
      'em verde, cada um com um laço rosa na cabeça, sobre fundo preto, com o nome do ' +
      'baile em letras vermelhas de pincel e duas abóboras também de laço rosa.',
  },

  // ── Preços ────────────────────────────────────────────────────────────────

  /** Por pessoa, comprando pelo site. */
  antecipado: 15,
  /** O casal, comprando pelo site. */
  antecipadoDupla: 25,
  /** Por pessoa, na portaria. Não se vende aqui: é só informação. */
  naHora: 20,

  /**
   * A venda antecipada fecha este tanto de minutos antes do baile.
   *
   * ⚠️  Este número é o único que vale. Até 20/10/2026 a página prometia "2h
   *     antes" num texto escrito à mão enquanto o código fechava em 1h: quem
   *     lesse a página teria uma hora a menos do que esperava.
   */
  fechaAntesEmMinutos: 60,
} as const;

/** O prazo da venda antecipada, como instante. */
export function fimDaVendaAntecipada(): Date {
  return new Date(new Date(BAILE.comecaEm).getTime() - BAILE.fechaAntesEmMinutos * 60_000);
}

/**
 * A venda antecipada ainda está aberta? Depois do prazo, a entrada só na
 * portaria — e o formulário para de oferecer o que não pode cumprir.
 *
 * Recebe o instante de propósito: assim o servidor e o navegador chegam ao
 * mesmo resultado sem depender de quando a função foi chamada. É a mesma
 * precaução do preço, e a razão de ela não ler o relógio por conta própria.
 */
export function vendaAntecipadaAberta(agora: Date = new Date()): boolean {
  return BAILE.ativo && agora.getTime() < fimDaVendaAntecipada().getTime();
}

/** Quanto custa o ingresso antecipado, no formato escolhido. */
export function precoDoIngresso(formato: Formato): number {
  return formato === 'dupla' ? BAILE.antecipadoDupla : BAILE.antecipado;
}

/**
 * Quanto a dupla economiza em relação a dois ingressos individuais. Zero ou
 * negativo quando não há vantagem — aí a página simplesmente não promete nada.
 */
export function economiaDaDupla(): number {
  return BAILE.antecipado * 2 - BAILE.antecipadoDupla;
}

/** Como o ingresso vai descrito na cobrança, na planilha e no recibo. */
export function descricaoDoIngresso(formato: Formato): string {
  const quem = formato === 'dupla' ? 'ingresso para dois' : 'ingresso individual';
  return `${BAILE.nome} — ${quem} · ${BAILE.dia}/${BAILE.mes} ${BAILE.horario}`;
}
