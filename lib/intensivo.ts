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
 *
 * O BAILE NÃO SE VENDE AQUI. Ele é produto próprio, mora em `lib/baile.ts` e é
 * vendido em `/baile`. Nesta edição ele aparece no cronograma do sábado, porque
 * é a noite que fecha o curso, e quem fecha as quatro aulas entra de graça —
 * mas a entrada não é um item deste carrinho.
 */

import { BAILE } from '@/lib/baile';
import type { Formato } from '@/lib/comum';

export type Nivel = 'Do Zero' | 'Intermediário' | 'Todos os níveis';

// O vocabulário compartilhado com o baile vive em `lib/comum.ts`. Reexportado
// aqui porque mais de quarenta lugares já importam estes nomes deste arquivo —
// mudar todos eles não compraria nada.
export {
  formatarReais,
  digitosDoTelefone,
  telefoneValido,
  formatarTelefone,
  whatsappComDdi,
  emailValido,
  type Formato,
} from '@/lib/comum';

/** O baile desta edição, para quem já importa daqui. A fonte é `lib/baile.ts`. */
export { BAILE } from '@/lib/baile';

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
   * O baile. Aparece no cronograma porque é a noite que fecha o curso, mas
   * **não se vende aqui**: o ingresso é comprado em `/baile`, e quem fecha as
   * aulas todas entra de graça (ver `DESCONTOS` e `entradaDoBaileInclusa`).
   */
  evento?: boolean;
  /**
   * Intervalo e prática: aparece no cronograma para mostrar o ritmo do dia,
   * mas não é vendido — não entra na seleção nem no total.
   */
  intervalo?: boolean;
  descricao?: string;
}

/**
 * Só o que pode ser comprado nesta página: as aulas.
 *
 * Intervalo nunca foi vendável. O baile deixou de ser em 20/10/2026, quando a
 * venda dele passou para `/baile` — e esta função é o ponto único onde isso é
 * decidido: a rota da API filtra por ela antes de calcular o preço, então um
 * id de baile que chegue pelo formulário é descartado no servidor, não só
 * escondido na tela.
 */
export function ehVendavel(aula: Aula): boolean {
  return !aula.intervalo && !aula.evento;
}

export const EDICAO = {
  /**
   * O interruptor geral. Com false, a página mostra "novas edições em breve"
   * e o formulário não é montado.
   */
  ativa: false,

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
    porAulaDupla: 45,
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
 *
 * Travado no primeiro lote (R$ 30 / R$ 45) em 20/10/2026, por decisão da
 * escola. Note que deixar `null` aqui NÃO manteria este preço: o calendário
 * viraria para o segundo lote — R$ 35 e R$ 60 — na meia-noite do dia 21, a um
 * dia do curso. Travar é o que garante o preço anunciado até o fim.
 */
export const LOTE_FORCADO: LoteId | null = 'primeiro';

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
  // Com um lote forçado, o calendário não manda mais — e a data-limite dele
  // pode até já ter passado. Prometer "vale até terça" nesse caso seria
  // mentira; melhor não prometer prazo nenhum.
  if (LOTE_FORCADO) return null;
  const lote = loteAtivo(agora);
  return lote.ate ? new Date(lote.ate) : null;
}

/**
 * Faixas de desconto por quantidade de aulas. Valem em todos os lotes.
 *
 * O desconto incide sobre as aulas. A faixa marcada `incluiBaile` dá a entrada
 * do baile: ela não entra na conta como item de valor zero — simplesmente não é
 * cobrada, e a planilha registra "entrada inclusa" para a portaria saber.
 */
export const DESCONTOS: {
  minimoAulas: number;
  percentual: number;
  /** A entrada do baile vai junto, sem custo. */
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
  // O baile fecha o sábado. Está aqui para aparecer no cronograma, com os
  // dados vindos de `lib/baile.ts` — uma data só, num lugar só. Não é vendido
  // nesta página: `ehVendavel` o exclui, e o ingresso se compra em /baile.
  {
    id: 'sab-baile',
    dia: BAILE.dia,
    mes: BAILE.mes,
    diaSemana: BAILE.diaSemana,
    horario: BAILE.horario,
    nome: BAILE.nome,
    nivel: 'Todos os níveis',
    evento: true,
    descricao: BAILE.observacao,
  },
];

/** Quantas aulas de verdade a edição tem — o baile e os intervalos ficam fora. */
export const TOTAL_DE_AULAS = AULAS.filter(ehVendavel).length;

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

/**
 * Endereço mandado à InfinitePay junto da cobrança.
 *
 * Não há nada para entregar — isto existe só para apagar a etapa "Entrega" do
 * checkout dela, que de outro modo pede o CEP de quem está comprando uma aula
 * de dança. Com o campo preenchido, o passo já nasce pronto.
 *
 * Testado em 19/10/2026, isolando um campo de cada vez:
 *   sem nada            → preenche Contato, preenche Entrega, paga
 *   só com `customer`   → preenche Entrega, paga
 *   com os dois         → cai direto no Pagamento
 *
 * O passo "Contato" (e-mail e confirmação do número) só desaparece se o
 * `customer` levar e-mail, que hoje não pedimos no formulário.
 *
 * É o endereço do local do curso, e é o que aparece no recibo da InfinitePay.
 */
export const ENDERECO_COBRANCA = {
  cep: '79002-160',
  street: 'R. Barão de Melgaço',
  neighborhood: 'Centro',
  number: '177',
  complement: 'Teatro do Mundo',
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

/**
 * Comunidade geral da escola: onde a próxima edição é anunciada.
 *
 * É o link do cabeçalho, do rodapé, da página de contato e de aulas regulares.
 * Serve a quem ainda não comprou nada.
 */
export const COMUNIDADE_WHATSAPP = 'https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T';

/**
 * Grupo DESTA edição do intensivo — outro grupo, outro link.
 *
 * É por ele que horário, local e mudanças de última hora chegam a quem já se
 * inscreveu, e por isso é a única ação da tela de confirmação: a inscrição
 * está paga, mas a pessoa só fica sabendo das coisas se entrar aqui.
 *
 * ⚠️  Troque a cada edição, junto com `EDICAO`. Um link velho manda o aluno
 *     novo para a turma do curso passado.
 */
export const GRUPO_INTENSIVO = 'https://chat.whatsapp.com/JAC5pq1CG141OZaziUXoM7';

/** Número de atendimento, só dígitos, com DDI. */
export const WHATSAPP_ESCOLA = '5567992630948';

// ─────────────────────────────────────────────────────────────────────────────
// Cálculo
//
// `Formato` — individual ou dupla — mora em `lib/comum.ts`, porque o ingresso
// do baile usa a mesma escolha. Está reexportado no topo deste arquivo.

export interface Orcamento {
  lote: Lote;
  /** Soma das aulas, antes do desconto. */
  subtotalAulas: number;
  /** O mesmo que `subtotalAulas`: o baile não é item desta conta. */
  subtotal: number;
  percentualDesconto: number;
  /** Quanto o desconto tirou, em reais. */
  desconto: number;
  total: number;
  quantidadeAulas: number;
  /**
   * A entrada do baile vai de graça com esta inscrição?
   *
   * Não soma nem subtrai nada do total — é um fato que a planilha registra
   * para a portaria saber quem entra sem ingresso. Quem não cai nesta faixa
   * compra o ingresso em /baile, à parte.
   */
  entradaDoBaileInclusa: boolean;
  /** O que falta para a próxima faixa, para avisar quem está quase lá. */
  proximaFaixa?: { faltam: number; percentual: number; incluiBaile: boolean };
}

export function aulaPorId(id: string): Aula | undefined {
  return AULAS.find((aula) => aula.id === id);
}

/**
 * Preço de uma aula, no lote que está valendo.
 *
 * Zero para o que não se vende aqui — intervalo e baile. O preço do ingresso do
 * baile está em `precoDoIngresso`, em `lib/baile.ts`.
 */
export function precoDe(aula: Aula, formato: Formato, lote: Lote = loteAtivo()): number {
  if (!ehVendavel(aula)) return 0;
  return formato === 'dupla' ? lote.porAulaDupla : lote.porAula;
}

/**
 * Calcula o valor de uma inscrição. É a mesma função usada pelo formulário e
 * pela rota da API: o servidor nunca confia no total que o navegador mandou.
 *
 * O baile não entra na conta — `ehVendavel` o descarta antes de tudo, mesmo que
 * o id dele chegue na lista. O que a faixa das quatro aulas dá é a entrada
 * franca, registrada em `entradaDoBaileInclusa`, sem virar linha de preço.
 */
export function calcularOrcamento(ids: readonly string[], formato: Formato): Orcamento {
  const lote = loteAtivo();

  const aulas = ids
    .map(aulaPorId)
    .filter((aula): aula is Aula => Boolean(aula))
    .filter(ehVendavel); // intervalo e baile não se compram aqui, nem por engano

  const quantidadeAulas = aulas.length;

  const faixa = DESCONTOS
    .filter((d) => quantidadeAulas >= d.minimoAulas)
    .sort((a, b) => b.minimoAulas - a.minimoAulas)[0];

  const subtotalAulas = aulas.reduce((soma, aula) => soma + precoDe(aula, formato, lote), 0);

  const percentualDesconto = faixa?.percentual ?? 0;
  // Arredonda para o real: ninguém paga centavo em inscrição de curso.
  const desconto = Math.round((subtotalAulas * percentualDesconto) / 100);

  const proxima = DESCONTOS
    .filter((d) => quantidadeAulas < d.minimoAulas && d.minimoAulas <= TOTAL_DE_AULAS)
    .sort((a, b) => a.minimoAulas - b.minimoAulas)[0];

  return {
    lote,
    subtotalAulas,
    subtotal: subtotalAulas,
    percentualDesconto,
    desconto,
    total: subtotalAulas - desconto,
    quantidadeAulas,
    entradaDoBaileInclusa: Boolean(faixa?.incluiBaile),
    proximaFaixa: proxima
      ? {
          faltam: proxima.minimoAulas - quantidadeAulas,
          percentual: proxima.percentual,
          incluiBaile: Boolean(proxima.incluiBaile),
        }
      : undefined,
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

// Telefone, e-mail e dinheiro ficam em `lib/comum.ts`, reexportados no topo
// deste arquivo: o baile precisa das mesmas regras e não pode depender daqui.
