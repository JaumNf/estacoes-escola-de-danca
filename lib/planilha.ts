/**
 * O caminho até a planilha do Google, compartilhado pelas rotas que vendem.
 *
 * Existe porque há dois produtos — a inscrição do intensivo e o ingresso do
 * baile — e os dois gravam na mesma aba, com as mesmas colunas. Duas cópias
 * deste tratamento de erro seria duas chances de uma delas ficar para trás.
 *
 * As colunas são fixas do lado do Apps Script (`scripts/planilha-inscricoes/
 * Codigo.gs`), que monta a linha a partir de `COLUNAS` e ignora campo que não
 * reconhece. Por isso `LinhaDaPlanilha` abaixo é o contrato: um produto novo
 * preenche os campos que fazem sentido para ele e deixa o resto em zero ou ''.
 *
 * Só roda no servidor: a URL e o token nunca entram no bundle.
 */

/** O que o Apps Script sabe gravar. Os nomes batem com os campos dele. */
export interface LinhaDaPlanilha {
  protocolo: string;
  enviadoEm: string;
  /** Nome do produto: a edição do curso, ou o nome do baile. */
  edicao: string;
  /** 'Lote promocional', 'Venda antecipada'… como aparece na coluna. */
  lote: string;
  formato: string;
  nome1: string;
  whatsapp1: string;
  /** A planilha ainda não tem coluna de e-mail; vai junto para quando tiver. */
  email1: string;
  nome2: string;
  whatsapp2: string;
  /** Descrição por extenso do que foi comprado. É a coluna mais larga. */
  aulas: string;
  quantidadeAulas: number;
  /** O que a coluna "Baile" diz desta linha. */
  baile: string;
  subtotalAulas: number;
  subtotalBaile: number;
  percentualDesconto: number;
  desconto: number;
  taxaCartao: number;
  total: number;
  totalFormatado: string;
  metodo: string;
  status: string;
  arquivo: { nome: string; tipo: string; base64: string } | null;
}

export interface Credenciais {
  url: string;
  token: string;
}

/**
 * Lê a configuração do ambiente. Devolve null quando falta algo — e aí a rota
 * tem de responder erro, nunca "deu tudo certo": sem destino, dizer que a
 * venda foi registrada é perdê-la em silêncio.
 */
export function credenciaisDaPlanilha(): Credenciais | null {
  const url = process.env.INSCRICOES_WEBHOOK_URL;
  const token = process.env.INSCRICOES_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export type ResultadoDaGravacao =
  | { ok: true; comprovanteUrl?: string }
  | { ok: false; motivo: string };

/**
 * Grava a linha. Qualquer resposta que não seja um JSON com `ok: true` é
 * falha — inclusive HTML, que é o que o Google devolve quando o script está
 * mal publicado e foi o que já nos fez pensar que a planilha estava fora.
 */
export async function gravarNaPlanilha(
  credenciais: Credenciais,
  linha: LinhaDaPlanilha,
): Promise<ResultadoDaGravacao> {
  let texto: string;
  try {
    const resposta = await fetch(credenciais.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // O Apps Script responde em segundos; sem teto, uma indisponibilidade do
      // Google deixaria a pessoa olhando o botão girar.
      signal: AbortSignal.timeout(20_000),
      // O Apps Script responde 302 para o domínio de conteúdo do Google.
      redirect: 'follow',
      body: JSON.stringify({ token: credenciais.token, ...linha }),
    });

    texto = await resposta.text();
    if (!resposta.ok) {
      return { ok: false, motivo: `planilha respondeu ${resposta.status}: ${texto.slice(0, 300)}` };
    }
  } catch (falha) {
    return { ok: false, motivo: `não consegui falar com a planilha: ${falha}` };
  }

  let resultado: { ok?: boolean; erro?: string; comprovanteUrl?: string };
  try {
    resultado = JSON.parse(texto);
  } catch {
    return { ok: false, motivo: `resposta não-JSON da planilha: ${texto.slice(0, 300)}` };
  }

  if (!resultado.ok) {
    return { ok: false, motivo: `planilha recusou: ${resultado.erro ?? 'sem motivo'}` };
  }

  return { ok: true, comprovanteUrl: resultado.comprovanteUrl };
}

/**
 * Protocolo curto e legível em voz alta, sem caracteres que se confundem
 * (0/O, 1/I/L). É o que a pessoa cita no WhatsApp, o que identifica a
 * transferência no extrato e a chave pela qual o webhook acha a linha.
 */
export function gerarProtocolo(): string {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  const aleatorio = new Uint8Array(6);
  crypto.getRandomValues(aleatorio);
  for (const byte of aleatorio) sufixo += alfabeto[byte % alfabeto.length];
  return `EST-${sufixo}`;
}

export function limparNome(bruto: string): string {
  return bruto.replace(/\s+/g, ' ').trim().slice(0, 80);
}
