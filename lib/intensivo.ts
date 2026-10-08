/**
 * Fonte única de verdade da edição atual do Curso Intensivo.
 *
 * Tudo que muda de uma edição para a outra — datas, aulas, lotes de preço,
 * chave PIX, link do cartão — está neste arquivo. A página, o formulário de
 * inscrição e a rota /api/inscricao leem daqui, então editar aqui basta: não há
 * preço nem data escritos em nenhum componente.
 *
 * ⚠️  Enquanto `EDICAO.ativa` for false, nada disso aparece para o visitante:
 *     a página mostra o aviso de "novas edições em breve".
 *     As linhas marcadas "CONFIRMAR" ainda esperam a informação da escola.
 */

export type Nivel = 'Do Zero' | 'Intermediário' | 'Todos os níveis';

export interface Aula {
  /** Identificador estável. Vai para a planilha e para o cálculo no servidor. */
  id: string;
  /** Dia do mês, só o número. Ex.: '24'. */
  dia: string;
  /** Mês abreviado em maiúsculas. Ex.: 'OUT'. */
  mes: string;
  diaSemana: string;
  /** Ex.: '18:30 às 20:00'. */
  horario: string;
  nome: string;
  nivel: Nivel;
  /**
   * Baile e afins: entram na seleção e têm preço próprio (ver `Lote`), mas não
   * contam como aula para as faixas de desconto.
   */
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
   * e o formulário não é montado.
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

// ─────────────────────────────────────────────────────────────────────────────
// Preços

export type LoteId = 'promocional' | 'primeiro' | 'segundo';

export interface Lote {
  id: LoteId;
  /** Como o lote aparece na etiqueta do formulário. */
  nome: string;
  /** Preço de uma aula, por pessoa, na inscrição individual. */
  porAula: number;
  /** Preço de uma aula para o casal — os dois juntos — na inscrição em dupla. */
  porAulaDupla: number;
  /**
   * Instante em que este lote deixa de valer, em ISO. O lote seguinte assume
   * exatamente aí. O último da lista não tem `ate`: vale até o fim.
   *
   * Vire à meia-noite: assim ninguém está com a página aberta na troca,
   * vendo um preço e sendo cobrado outro.
   */
  ate?: string;
}

/**
 * O baile tem preço próprio, igual em todos os lotes: mais barato para quem
 * compra adiantado, mais caro na portaria.
 */
export const BAILE = {
  /** Por pessoa, comprando pelo site. */
  antecipado: 15,
  /** O casal, comprando pelo site. */
  antecipadoDupla: 25,
  /** Por pessoa, na portaria. Não se vende aqui: é só informação. */
  naHora: 20,
  /** Início do baile, em ISO — é a partir daqui que o prazo é contado. */
  comecaEm: '2026-10-24T20:00:00-04:00',
  /** A venda antecipada fecha este tanto de minutos antes do baile. */
  fechaAntesEmMinutos: 60,
} as const;

/**
 * A venda antecipada ainda está aberta? Depois do prazo, a entrada só na
 * portaria — e o formulário para de oferecer o que não pode cumprir.
 *
 * Recebe o instante de propósito: assim o servidor e o navegador chegam ao
 * mesmo resultado sem depender de quando a função foi chamada.
 */
export function vendaAntecipadaDoBaileAberta(agora: Date = new Date()): boolean {
  const limite = new Date(BAILE.comecaEm).getTime() - BAILE.fechaAntesEmMinutos * 60_000;
  return agora.getTime() < limite;
}

export const LOTES: Lote[] = [
  {
    id: 'promocional',
    nome: 'Lote promocional',
    porAula: 25,
    porAulaDupla: 40,
    // Vira primeiro lote no dia 14.
    ate: '2026-10-14T00:00:00-04:00',
  },
  {
    id: 'primeiro',
    nome: 'Primeiro lote',
    porAula: 30,
    porAulaDupla: 50,
    // Vira segundo lote no dia 21.
    ate: '2026-10-21T00:00:00-04:00',
  },
  {
    id: 'segundo',
    nome: 'Segundo lote',
    porAula: 35,
    porAulaDupla: 60,
  },
];

/**
 * Força um lote, ignorando as datas. Serve para antecipar ou segurar uma
 * virada à mão. Deixe `null` para o calendário mandar.
 */
export const LOTE_FORCADO: LoteId | null = null;

/**
 * O lote que está valendo agora: o primeiro cuja data-limite ainda não passou.
 *
 * Recebe o instante de propósito. Quem decide o preço cobrado é o servidor, no
 * momento da inscrição — é a mesma precaução do prazo do baile, e a razão de
 * esta função não ler o relógio por conta própria lá dentro.
 */
export function loteAtivo(agora: Date = new Date()): Lote {
  if (LOTE_FORCADO) {
    const forcado = LOTES.find((lote) => lote.id === LOTE_FORCADO);
    if (forcado) return forcado;
  }
  const emVigor = LOTES.find((lote) => !lote.ate || agora.getTime() < new Date(lote.ate).getTime());
  return emVigor ?? LOTES[LOTES.length - 1];
}

/** Quando o lote atual vira, para avisar no formulário. Null no último. */
export function viradaDoLote(agora: Date = new Date()): Date | null {
  const lote = loteAtivo(agora);
  return lote.ate ? new Date(lote.ate) : null;
}

/**
 * Faixas de desconto por quantidade de aulas. Valem em todos os lotes.
 * O desconto incide sobre as aulas; a entrada do baile não é descontada —
 * ou vem de brinde, na faixa que tem `incluiBaile`.
 */
export const DESCONTOS: {
  minimoAulas: number;
  percentual: number;
  /** Ganha a entrada do baile junto. */
  incluiBaile?: boolean;
}[] = [
  { minimoAulas: 3, percentual: 10 },
  { minimoAulas: 4, percentual: 15, incluiBaile: true },
];

/**
 * As aulas da edição, na ordem em que aparecem no cronograma e no formulário.
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
  },
  {
    id: 'sex-intervalo',
    dia: '23',
    mes: 'OUT',
    diaSemana: 'Sexta-feira',
    horario: '20:00 às 20:30',
    nome: 'Intervalo e prática',
    nivel: 'Todos os níveis',
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
  },
  {
    id: 'sab-intervalo',
    dia: '24',
    mes: 'OUT',
    diaSemana: 'Sábado',
    horario: '16:00 às 16:30',
    nome: 'Intervalo e prática',
    nivel: 'Todos os níveis',
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
  },
  {
    id: 'sab-baile',
    dia: '24',
    mes: 'OUT',
    diaSemana: 'Sábado',
    horario: '20:00 às 01:00',
    nome: 'Baile de Halloween',
    nivel: 'Todos os níveis',
    evento: true,
    descricao: 'Fantasia é opcional, mas a gente sabe que você quer.',
  },
];

/** Quantas aulas de verdade a edição tem — o baile e os intervalos ficam fora. */
export const TOTAL_DE_AULAS = AULAS.filter((a) => ehVendavel(a) && !a.evento).length;

// ─────────────────────────────────────────────────────────────────────────────
// Pagamento

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

  /**
   * Link de pagamento da operadora.
   *
   * Se o link aceitar o valor pela URL, escreva `{valor}` (em reais, com
   * ponto: 85.00) ou `{centavos}` (8500) no lugar do número — o site preenche
   * sozinho com o total da inscrição, e ninguém digita errado. Exemplos:
   *     'https://invoice.infinitepay.io/plans/estacoes/{centavos}'
   *     'https://pag.ae/abc?valor={valor}'
   *
   * Sem placeholder, o link abre do jeito que estiver e o formulário mostra à
   * pessoa quanto ela precisa digitar lá. Funciona, mas confere o comprovante.
   */
  url: '',

  operadora: 'InfinitePay',

  /**
   * Taxa do crédito à vista (confirmada em 07/10/2026 numa cobrança real: a
   * InfinitePay somou R$ 4,39 a uma cobrança de R$ 100).
   *
   * ⚠️  Este número serve só para ESTIMAR e avisar a pessoa. Quem acrescenta a
   *     taxa é a InfinitePay, na página dela — veja `totalNoCredito`.
   *
   * O parcelamento não entra aqui: quem parcela escolhe na página da operadora
   * e paga os juros dela, enquanto a escola recebe o mesmo.
   */
  taxaPercentual: 4.2,
  /** Taxa fixa por transação, se a operadora cobrar uma. Em reais. */
  taxaFixa: 0,

  /** Observação curta mostrada abaixo do botão. Deixe '' para esconder. */
  observacao: 'Parcelamento em até 12x, com juros da operadora.',
} as const;

/**
 * ESTIMATIVA de quanto a pessoa verá no crédito.
 *
 * ⚠️  Isto NÃO é o que o site cobra. A InfinitePay acrescenta a taxa sozinha
 *     na página de pagamento: uma cobrança criada com R$ 100 aparece lá como
 *     "Valor R$ 100 + Taxas R$ 4,39 = R$ 104,39" no crédito, e como R$ 100 no
 *     PIX. Quem recebe fica com os R$ 100 nos dois casos.
 *
 *     Por isso o site sempre manda o preço de tabela para o checkout. Mandar o
 *     valor já acrescido faria a taxa ser cobrada duas vezes.
 *
 * A fórmula é a mesma que a InfinitePay usa — dividir, não somar, porque o
 * percentual incide sobre o valor cobrado e não sobre o líquido: R$ 100 a 4,2%
 * dá 100 ÷ 0,958 = R$ 104,39, e não R$ 104,20. Serve para avisar a pessoa
 * antes de ela sair do site.
 */
export function totalNoCredito(total: number): number {
  const { taxaPercentual, taxaFixa } = CREDITO;
  if (taxaPercentual <= 0 && taxaFixa <= 0) return total;
  const bruto = (total + taxaFixa) / (1 - taxaPercentual / 100);
  return Math.ceil(bruto * 100) / 100;
}

/** Quanto a taxa acrescenta, em reais. Estimativa, pelo mesmo motivo acima. */
export function taxaDoCredito(total: number): number {
  return Math.round((totalNoCredito(total) - total) * 100) / 100;
}

/**
 * Checkout automático da InfinitePay: a pessoa paga na página deles e o site
 * confirma sozinho pelo webhook, sem comprovante e sem conferência manual.
 *
 * Com `ativo: false`, tudo continua como antes — PIX no QR Code e comprovante
 * anexado à mão. Mesmo ligado, o caminho manual segue disponível como
 * alternativa para quem pagar por fora.
 */
export const CHECKOUT = {
  ativo: true,
  /** Seu handle da InfiniteTag, sem o "$". É o que identifica a conta. */
  handle: 'estacoesdanca',
} as const;

/** Monta o link do crédito com o valor desta inscrição, quando der. */
export function linkDoCredito(total: number): string {
  return CREDITO.url
    .replace('{valor}', total.toFixed(2))
    .replace('{centavos}', String(Math.round(total * 100)));
}

/** O link leva o valor embutido? Muda o que o formulário promete à pessoa. */
export function creditoLevaOValor(): boolean {
  return /\{valor\}|\{centavos\}/.test(CREDITO.url);
}

/** Grupo onde a próxima edição é anunciada. */
export const COMUNIDADE_WHATSAPP = 'https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T';

/** Número de atendimento, só dígitos, com DDI. */
export const WHATSAPP_ESCOLA = '5567992630948';

// ─────────────────────────────────────────────────────────────────────────────
// Cálculo

export type Formato = 'individual' | 'dupla';

export interface Orcamento {
  lote: Lote;
  /** Soma só das aulas, antes do desconto. */
  subtotalAulas: number;
  /** Entrada do baile, quando escolhida e não ganha de brinde. */
  subtotalBaile: number;
  /** Tudo somado, antes do desconto. */
  subtotal: number;
  percentualDesconto: number;
  /** Quanto o desconto tirou, em reais. Incide só sobre as aulas. */
  desconto: number;
  total: number;
  /** Quantas aulas de verdade — o baile não entra. */
  quantidadeAulas: number;
  /** O baile foi escolhido? */
  baileEscolhido: boolean;
  /** O baile saiu de graça pela faixa de desconto? */
  baileDeBrinde: boolean;
  /** O que falta para a próxima faixa, para avisar quem está quase lá. */
  proximaFaixa?: { faltam: number; percentual: number; incluiBaile: boolean };
}

export function aulaPorId(id: string): Aula | undefined {
  return AULAS.find((aula) => aula.id === id);
}

/** Preço de um item avulso, no lote que está valendo. */
export function precoDe(aula: Aula, formato: Formato, lote: Lote = loteAtivo()): number {
  if (aula.intervalo) return 0;
  // O baile não acompanha o lote: tem preço próprio, de venda antecipada.
  if (aula.evento) return formato === 'dupla' ? BAILE.antecipadoDupla : BAILE.antecipado;
  return formato === 'dupla' ? lote.porAulaDupla : lote.porAula;
}

/**
 * Calcula o valor de uma inscrição. É a mesma função usada pelo formulário e
 * pela rota da API: o servidor nunca confia no total que o navegador mandou.
 *
 * Regras: o desconto incide sobre as aulas, não sobre a entrada do baile. Na
 * faixa marcada com `incluiBaile`, a entrada do baile não é cobrada.
 */
export function calcularOrcamento(ids: readonly string[], formato: Formato): Orcamento {
  const lote = loteAtivo();

  const escolhidas = ids
    .map(aulaPorId)
    .filter((aula): aula is Aula => Boolean(aula))
    .filter(ehVendavel); // intervalo não se compra, nem por engano

  const aulas = escolhidas.filter((aula) => !aula.evento);
  const baile = escolhidas.find((aula) => aula.evento);
  const quantidadeAulas = aulas.length;

  const faixa = DESCONTOS
    .filter((d) => quantidadeAulas >= d.minimoAulas)
    .sort((a, b) => b.minimoAulas - a.minimoAulas)[0];

  const baileDeBrinde = Boolean(baile) && Boolean(faixa?.incluiBaile);

  const subtotalAulas = aulas.reduce((soma, aula) => soma + precoDe(aula, formato, lote), 0);
  const subtotalBaile = baile && !baileDeBrinde ? precoDe(baile, formato, lote) : 0;

  const percentualDesconto = faixa?.percentual ?? 0;
  // Arredonda para o real: ninguém paga centavo em inscrição de curso.
  const desconto = Math.round((subtotalAulas * percentualDesconto) / 100);

  const proxima = DESCONTOS
    .filter((d) => quantidadeAulas < d.minimoAulas && d.minimoAulas <= TOTAL_DE_AULAS)
    .sort((a, b) => a.minimoAulas - b.minimoAulas)[0];

  return {
    lote,
    subtotalAulas,
    subtotalBaile,
    subtotal: subtotalAulas + subtotalBaile,
    percentualDesconto,
    desconto,
    total: subtotalAulas + subtotalBaile - desconto,
    quantidadeAulas,
    baileEscolhido: Boolean(baile),
    baileDeBrinde,
    proximaFaixa: proxima
      ? {
          faltam: proxima.minimoAulas - quantidadeAulas,
          percentual: proxima.percentual,
          incluiBaile: Boolean(proxima.incluiBaile),
        }
      : undefined,
  };
}

/**
 * A regra do baile, aplicada em cima de uma seleção nova.
 *
 * Completou as aulas todas, o baile entra sozinho — é brinde, e ninguém devia
 * precisar descobrir isso marcando mais uma caixa. Se depois tirar uma aula, o
 * baile que entrou sozinho sai junto: deixá-lo marcado viraria uma cobrança
 * que a pessoa não pediu.
 *
 * O momento em que ela mexe no baile com a própria mão encerra o automático: a
 * partir dali a escolha é dela, e a gente não desfaz nem refaz.
 *
 * Fica aqui, e não no componente, porque é regra de negócio: assim dá para
 * testá-la sem navegador.
 */
export interface EstadoDoBaile {
  /** O baile presente na seleção entrou por brinde, e não por escolha. */
  baileAutomatico: boolean;
  /** A pessoa já tirou o baile com a própria mão. Não se oferece de novo. */
  baileRecusado: boolean;
}

export function aplicarRegraDoBaile(
  proximas: readonly string[],
  opcoes: Partial<EstadoDoBaile> & {
    /** Esta mudança foi a pessoa marcando ou desmarcando o próprio baile? */
    mexeuNoBaile?: boolean;
    /** A venda antecipada ainda está aberta? Fora do prazo, não se oferece. */
    vendaAberta?: boolean;
  },
): EstadoDoBaile & { selecao: string[] } {
  const {
    baileAutomatico = false,
    baileRecusado = false,
    mexeuNoBaile = false,
    vendaAberta = true,
  } = opcoes;

  const selecao = [...proximas];
  const baile = AULAS.find((aula) => aula.evento);
  if (!baile) return { selecao, baileAutomatico: false, baileRecusado };

  const temBaile = selecao.includes(baile.id);

  // A pessoa mexeu no baile: a escolha passa a ser dela, e tirar é uma recusa
  // que vale para o resto da inscrição — senão o baile voltaria sozinho na
  // próxima vez que ela completasse as aulas.
  if (mexeuNoBaile) {
    return { selecao, baileAutomatico: false, baileRecusado: !temBaile };
  }

  const quantasAulas = selecao.filter((id) => {
    const aula = aulaPorId(id);
    return aula && ehVendavel(aula) && !aula.evento;
  }).length;
  const completou = quantasAulas >= TOTAL_DE_AULAS;

  if (completou && !temBaile && vendaAberta && !baileRecusado) {
    return { selecao: [...selecao, baile.id], baileAutomatico: true, baileRecusado };
  }

  if (!completou && temBaile && baileAutomatico) {
    return {
      selecao: selecao.filter((id) => id !== baile.id),
      baileAutomatico: false,
      baileRecusado,
    };
  }

  return { selecao, baileAutomatico, baileRecusado };
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

// ─────────────────────────────────────────────────────────────────────────────
// Telefone
//
// Mora aqui, e não no formulário, porque o servidor precisa da mesma regra.
// Quando as duas pontas tinham cópias diferentes, um número digitado com o
// código do país chegou torto na planilha: "(55) 67992-6309".

/**
 * Só os dígitos do número nacional: sem código de país, sem zero de discagem.
 *
 * O cuidado aqui é que **DDD 55 existe** (Santa Maria, RS). Então o "55" da
 * frente só é tratado como código do país quando o número não caberia num
 * nacional — que tem 10 ou 11 dígitos. Com 12 ou 13, o 55 sobra, e aí é DDI.
 */
export function digitosDoTelefone(bruto: string): string {
  let d = bruto.replace(/\D/g, '');
  // "0" ou "021" na frente é prefixo de discagem, não faz parte do número.
  d = d.replace(/^0+/, '');
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) d = d.slice(2);
  return d.slice(0, 11);
}

/** Celular (11 dígitos) ou fixo (10), já descontados DDI e zeros. */
export function telefoneValido(bruto: string): boolean {
  const d = digitosDoTelefone(bruto);
  return d.length === 10 || d.length === 11;
}

/** (67) 99263-0948 — a máscara que o campo mostra enquanto se digita. */
export function formatarTelefone(bruto: string): string {
  const d = digitosDoTelefone(bruto);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Com o DDI, como a planilha e o WhatsApp esperam. Null se não for válido. */
export function whatsappComDdi(bruto: string): string | null {
  const d = digitosDoTelefone(bruto);
  return telefoneValido(d) ? `55${d}` : null;
}

export function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
