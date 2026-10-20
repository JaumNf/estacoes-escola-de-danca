/**
 * O vocabulário que o intensivo e o baile dividem: dinheiro, telefone, e-mail,
 * e a escolha entre inscrição individual e em dupla.
 *
 * Mora aqui, e não em `lib/intensivo.ts`, porque o baile também precisa disto.
 * Se ficasse lá, `lib/baile.ts` teria de importar o intensivo e o intensivo
 * teria de importar o baile — um ciclo, por causa de uma máscara de telefone.
 *
 * `lib/intensivo.ts` reexporta tudo isto, então os quarenta e tantos lugares
 * que já escrevem `import { formatarReais } from '@/lib/intensivo'` continuam
 * valendo sem alteração.
 */

/** Uma pessoa ou um casal. Vale igual para a aula e para o ingresso do baile. */
export type Formato = 'individual' | 'dupla';

export function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Telefone
//
// O servidor precisa da mesma regra que o formulário. Quando as duas pontas
// tinham cópias diferentes, um número digitado com o código do país chegou
// torto na planilha: "(55) 67992-6309".

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

/**
 * Validação de e-mail deliberadamente frouxa: algo@algo.algo.
 *
 * Quem erra o próprio e-mail não é pego por regra nenhuma, e regra apertada
 * rejeita endereço legítimo — o que aqui custaria uma venda. O e-mail serve
 * para a InfinitePay aceitar o contato pronto, não para nos comunicarmos.
 */
export function emailValido(bruto: string): boolean {
  const e = bruto.trim();
  return e.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}
