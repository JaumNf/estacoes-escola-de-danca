/**
 * Gerador de "PIX Copia e Cola" (BR Code), no formato EMV® QRCPS-MPM que o
 * Banco Central padronizou no Manual de Padrões para Iniciação do PIX.
 *
 * A string é uma sequência de campos ID + tamanho + valor, onde o tamanho tem
 * sempre dois dígitos. O último campo é o CRC16 do que veio antes, incluindo o
 * próprio "6304". Com o valor preenchido, o app do banco já abre com o total
 * certo e a pessoa não erra o centavo.
 *
 * Sem dependência externa de propósito: são 60 linhas e o payload precisa ser
 * byte-a-byte igual ao que os bancos esperam.
 */

/** ID + tamanho em dois dígitos + valor. */
function campo(id: string, valor: string): string {
  return `${id}${valor.length.toString().padStart(2, '0')}${valor}`;
}

/** CRC16/CCITT-FALSE: polinômio 0x1021, valor inicial 0xFFFF. */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Deixa o texto no formato que o padrão aceita: sem acento, sem símbolo,
 * em maiúsculas e dentro do limite de caracteres do campo.
 *
 * O segundo `trim()` não é redundante: tirar um símbolo do meio do nome
 * ("Dança & Cia") deixa espaço duplo, e o corte no limite pode terminar
 * exatamente num espaço. Nome com espaço sobrando no fim aparece torto no
 * app de quem paga.
 */
function sanitizar(texto: string, limite: number): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase()
    .trim()
    .slice(0, limite)
    .trim();
}

export interface DadosPix {
  /** Chave PIX: e-mail, telefone (+55…), CPF/CNPJ ou chave aleatória. */
  chave: string;
  /** Nome do titular da conta. Até 25 caracteres no padrão. */
  beneficiario: string;
  /** Cidade do titular. Até 15 caracteres no padrão. */
  cidade: string;
  /** Valor em reais. Omita para deixar a pessoa digitar no app. */
  valor?: number;
  /**
   * Identificador da cobrança, até 25 caracteres alfanuméricos. Volta no
   * extrato e no comprovante, então é por aqui que a inscrição é reconciliada.
   */
  identificador?: string;
}

export function gerarPixCopiaECola({
  chave,
  beneficiario,
  cidade,
  valor,
  identificador,
}: DadosPix): string {
  const contaPix =
    campo('00', 'BR.GOV.BCB.PIX') + campo('01', chave.trim());

  // '***' é o curinga do padrão para "sem identificador".
  const txid = identificador ? sanitizar(identificador, 25).replace(/ /g, '') : '***';

  const payload =
    campo('00', '01') +                           // formato do payload
    campo('26', contaPix) +                       // conta PIX do recebedor
    campo('52', '0000') +                         // categoria do estabelecimento
    campo('53', '986') +                          // moeda: real
    (valor && valor > 0 ? campo('54', valor.toFixed(2)) : '') +
    campo('58', 'BR') +                           // país
    campo('59', sanitizar(beneficiario, 25)) +
    campo('60', sanitizar(cidade, 15)) +
    campo('62', campo('05', txid)) +              // dados adicionais
    '6304';                                       // o CRC entra a seguir

  return payload + crc16(payload);
}
