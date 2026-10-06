/**
 * Fonte única de verdade da edição atual do Curso Intensivo.
 *
 * Tudo que muda de uma edição para a outra — datas, aulas, preços, chave PIX,
 * link do cartão — está neste arquivo. A página, o formulário de inscrição e a
 * rota /api/inscricao leem daqui, então editar aqui basta: não há preço nem
 * data escritos em nenhum componente.
 *
 * ⚠️  OS VALORES MARCADOS COM "CONFIRMAR" SÃO UM ESQUELETO, NÃO A EDIÇÃO REAL.
 *     Enquanto `EDICAO.ativa` for false, nada disso aparece para o visitante:
 *     a página mostra o aviso de "novas edições em breve". Confirme os dados,
 *     troque `ativa` para true e o formulário entra no ar.
 */

export type Nivel = 'Do Zero' | 'Intermediário' | 'Todos os níveis';

export interface Aula {
  /** Identificador estável. Vai para a planilha e para o cálculo no servidor. */
  id: string;
  /** Dia do mês, só o número. Ex.: '31'. */
  dia: string;
  /** Mês abreviado em maiúsculas. Ex.: 'OUT'. */
  mes: string;
  diaSemana: string;
  /** Ex.: '18:40 às 20:00'. */
  horario: string;
  nome: string;
  nivel: Nivel;
  /** Preço por pessoa, em reais, na inscrição individual. */
  preco: number;
  /** Preço do casal — os dois juntos — na inscrição em dupla. */
  precoDupla: number;
  /** Baile e afins: entram na seleção, mas não contam como aula no desconto. */
  evento?: boolean;
  /**
   * Intervalo e prática: aparece no cronograma para mostrar o ritmo do dia,
   * mas não é vendido — não entra na seleção nem no total.
   */
  intervalo?: boolean;
  descricao?: string;
}

/** Só o que pode ser comprado: tira os intervalos da jogada. */
export function ehVendavel(aula: Aula): boolean {
  return !aula.intervalo;
}

export const EDICAO = {
  /**
   * O interruptor geral. Com false, a página mostra "novas edições em breve"
   * e o formulário não é montado. Vire para true só quando as linhas marcadas
   * com CONFIRMAR estiverem conferidas.
   */
  ativa: true,

  nome: 'Intensivo de Halloween',
  /** Aparece no hero, abaixo do título. */
  chamada: 'Quatro aulas, duas noites e um baile para fechar outubro dançando.',
  /** Texto curto de período. */
  periodo: 'Dias 23 e 24 de outubro',
  /** Data e hora do início, em ISO, para a contagem regressiva. */
  comecaEm: '2026-10-23T18:30:00-04:00',
  local: 'Teatro do Mundo — R. Barão de Melgaço, 177',
  cidade: 'Campo Grande, MS',
} as const;

/**
 * As aulas da edição, na ordem em que aparecem no formulário.
 * CONFIRMAR: ritmos, horários, níveis e preços.
 */
export const AULAS: Aula[] = [
  // ── Sexta, 23 de outubro — noite ──────────────────────────────────────────
  {
    id: 'sex-bachata',
    dia: '23',
    mes: 'OUT',
    diaSemana: 'Sexta-feira',
    horario: '18:30 às 20:00',
    nome: 'Bachata',
    nivel: 'Do Zero',
    preco: 25, // CONFIRMAR
    precoDupla: 40, // CONFIRMAR
  },
  {
    id: 'sex-intervalo',
    dia: '23',
    mes: 'OUT',
    diaSemana: 'Sexta-feira',
    horario: '20:00 às 20:30',
    nome: 'Intervalo e prática',
    nivel: 'Todos os níveis',
    preco: 0,
    precoDupla: 0,
    intervalo: true,
    descricao: 'Meia hora para respirar, treinar o que acabou de aprender e conversar.',
  },
  {
    id: 'sex-zouk',
    dia: '23',
    mes: 'OUT',
    diaSemana: 'Sexta-feira',
    horario: '20:30 às 22:00',
    nome: 'Zouk',
    nivel: 'Do Zero',
    preco: 25, // CONFIRMAR
    precoDupla: 40, // CONFIRMAR
  },

  // ── Sábado, 24 de outubro — tarde e noite ─────────────────────────────────
  {
    id: 'sab-forro',
    dia: '24',
    mes: 'OUT',
    diaSemana: 'Sábado',
    horario: '14:30 às 16:00',
    nome: 'Forró',
    nivel: 'Do Zero',
    preco: 25, // CONFIRMAR
    precoDupla: 40, // CONFIRMAR
  },
  {
    id: 'sab-intervalo',
    dia: '24',
    mes: 'OUT',
    diaSemana: 'Sábado',
    horario: '16:00 às 16:30',
    nome: 'Intervalo e prática',
    nivel: 'Todos os níveis',
    preco: 0,
    precoDupla: 0,
    intervalo: true,
    descricao: 'Meia hora para respirar, treinar o que acabou de aprender e conversar.',
  },
  {
    id: 'sab-lambada',
    dia: '24',
    mes: 'OUT',
    diaSemana: 'Sábado',
    horario: '16:30 às 18:00',
    nome: 'Lambada',
    nivel: 'Do Zero',
    preco: 25, // CONFIRMAR
    precoDupla: 40, // CONFIRMAR
  },
  {
    id: 'sab-baile',
    dia: '24',
    mes: 'OUT',
    diaSemana: 'Sábado',
    horario: '20:00 às 01:00',
    nome: 'Baile de Halloween',
    nivel: 'Todos os níveis',
    preco: 25, // CONFIRMAR
    precoDupla: 40, // CONFIRMAR
    evento: true,
    descricao: 'Fantasia é opcional, mas a gente sabe que você quer.',
  },
];

/**
 * Desconto progressivo por quantidade de aulas. O baile não conta como aula,
 * mas o valor dele entra no total antes do desconto.
 *
 * Deixe a lista vazia para cobrar a soma simples das aulas escolhidas.
 * CONFIRMAR.
 */
export const DESCONTOS: { minimoAulas: number; percentual: number }[] = [
  { minimoAulas: 2, percentual: 10 }, // CONFIRMAR
  { minimoAulas: 4, percentual: 20 }, // CONFIRMAR
];

/**
 * Conta de recebimento. A chave e o nome precisam bater com a conta de
 * verdade: é com eles que o QR Code é montado.
 */
export const PIX = {
  ativo: true,
  chave: 'cursodeverao67@gmail.com',
  /** Titular da conta, como aparece escrito na tela do formulário. */
  beneficiario: 'Gustavo Issao Kawamoto de Araujo',
  /**
   * O mesmo nome dentro do QR Code. O padrão do Banco Central limita este
   * campo a 25 caracteres: o nome completo tem 32 e seria cortado em
   * "GUSTAVO ISSAO KAWAMOTO DE", que fica estranho no app de quem paga.
   * Esta versão abreviada cabe inteira e continua reconhecível.
   */
  nomeNoQr: 'Gustavo I. K. de Araujo',
  /** Até 15 caracteres, sem acento. */
  cidade: 'CAMPO GRANDE',
} as const;

/**
 * Pagamento no crédito por link (InfinitePay, PagBank e similares).
 *
 * Como ligar:
 *   1. No app, crie um link de pagamento com o valor em aberto
 *      (InfinitePay: "Link de pagamento" → "Valor livre").
 *   2. Cole o link em `url` e troque `ativo` para true.
 *
 * O link abre numa aba nova; a pessoa volta e anexa o comprovante do mesmo
 * jeito, então o fluxo do formulário não muda.
 */
export const CREDITO = {
  ativo: false,
  url: '', // ex.: 'https://pag.ae/...' ou 'https://invoice.infinitepay.io/...'
  operadora: 'InfinitePay',
  /** Observação curta mostrada abaixo do botão. Deixe '' para esconder. */
  observacao: 'Parcelamento em até 12x, com juros da operadora.',
} as const;

/** Grupo onde a próxima edição é anunciada. */
export const COMUNIDADE_WHATSAPP = 'https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T';

/** Número de atendimento, só dígitos, com DDI. */
export const WHATSAPP_ESCOLA = '5567992630948';

// ─────────────────────────────────────────────────────────────────────────────

export type Formato = 'individual' | 'dupla';

export interface Orcamento {
  /** Soma dos itens escolhidos, antes do desconto. */
  subtotal: number;
  /** Percentual aplicado (0 quando nenhuma faixa foi atingida). */
  percentualDesconto: number;
  /** Quanto o desconto tirou, em reais. */
  desconto: number;
  total: number;
  /** Quantas aulas de verdade — o baile não entra. */
  quantidadeAulas: number;
}

export function aulaPorId(id: string): Aula | undefined {
  return AULAS.find((aula) => aula.id === id);
}

/**
 * Calcula o valor de uma inscrição. É a mesma função usada pelo formulário e
 * pela rota da API: o servidor nunca confia no total que o navegador mandou.
 */
export function calcularOrcamento(ids: readonly string[], formato: Formato): Orcamento {
  const escolhidas = ids
    .map(aulaPorId)
    .filter((aula): aula is Aula => Boolean(aula))
    .filter(ehVendavel); // intervalo não se compra, nem por engano

  const subtotal = escolhidas.reduce(
    (soma, aula) => soma + (formato === 'dupla' ? aula.precoDupla : aula.preco),
    0,
  );

  const quantidadeAulas = escolhidas.filter((aula) => !aula.evento).length;

  const faixa = DESCONTOS
    .filter((d) => quantidadeAulas >= d.minimoAulas)
    .sort((a, b) => b.percentual - a.percentual)[0];

  const percentualDesconto = faixa?.percentual ?? 0;
  // Arredonda para o real: ninguém paga centavo em inscrição de curso.
  const desconto = Math.round((subtotal * percentualDesconto) / 100);

  return {
    subtotal,
    percentualDesconto,
    desconto,
    total: subtotal - desconto,
    quantidadeAulas,
  };
}

/** Agrupa as aulas por dia, preservando a ordem do array. */
export function aulasPorDia(): { dia: string; mes: string; diaSemana: string; aulas: Aula[] }[] {
  const dias: { dia: string; mes: string; diaSemana: string; aulas: Aula[] }[] = [];
  for (const aula of AULAS) {
    const atual = dias.at(-1);
    if (atual && atual.dia === aula.dia && atual.mes === aula.mes) {
      atual.aulas.push(aula);
    } else {
      dias.push({ dia: aula.dia, mes: aula.mes, diaSemana: aula.diaSemana, aulas: [aula] });
    }
  }
  return dias;
}

export function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
