/**
 * Recebe as inscrições do site da Estações e grava numa planilha do Google,
 * salvando o comprovante no Drive.
 *
 * Isto NÃO roda no site: é um Google Apps Script, colado em script.google.com
 * e publicado como "Aplicativo da Web". O site fala com ele pela rota
 * /api/inscricao. O passo a passo está no README.md desta pasta.
 */

const CONFIG = {
  /** ID da planilha: está na URL, entre /d/ e /edit. */
  PLANILHA_ID: 'COLE_O_ID_DA_PLANILHA_AQUI',

  /** Nome da aba. Se não existir, o script cria. */
  ABA: 'Inscrições',

  /** ID da pasta do Drive onde os comprovantes ficam: está na URL da pasta. */
  PASTA_COMPROVANTES_ID: 'COLE_O_ID_DA_PASTA_AQUI',

  /**
   * Segredo combinado com o site. Tem que ser idêntico ao INSCRICOES_TOKEN
   * configurado na Vercel. Invente uma frase longa e aleatória.
   */
  TOKEN: 'COLE_O_MESMO_TOKEN_DA_VERCEL_AQUI',
};

const COLUNAS = [
  'Recebido em',
  'Protocolo',
  'Edição',
  'Formato',
  'Nome 1',
  'WhatsApp 1',
  'Nome 2',
  'WhatsApp 2',
  'Aulas',
  'Qtd. aulas',
  'Subtotal',
  'Desconto %',
  'Desconto',
  'Total',
  'Pagamento',
  'Comprovante',
  'Status',
];

function doPost(e) {
  // Uma inscrição por vez: duas pessoas clicando junto não podem escrever na
  // mesma linha nem criar o cabeçalho duas vezes.
  const trava = LockService.getScriptLock();
  try {
    trava.waitLock(30000);
  } catch (err) {
    return responder({ ok: false, erro: 'planilha ocupada' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responder({ ok: false, erro: 'corpo vazio' });
    }

    const dados = JSON.parse(e.postData.contents);

    if (!CONFIG.TOKEN || CONFIG.TOKEN.indexOf('COLE_') === 0) {
      return responder({ ok: false, erro: 'token não configurado no script' });
    }
    if (dados.token !== CONFIG.TOKEN) {
      return responder({ ok: false, erro: 'token inválido' });
    }

    const aba = obterAba();

    // Comprovante: grava no Drive e guarda o link na planilha.
    let linkComprovante = '';
    if (dados.arquivo && dados.arquivo.base64) {
      linkComprovante = salvarComprovante(dados);
    }

    aba.appendRow([
      formatarData(dados.enviadoEm),
      dados.protocolo || '',
      dados.edicao || '',
      dados.formato || '',
      dados.nome1 || '',
      formatarWhatsapp(dados.whatsapp1),
      dados.nome2 || '',
      formatarWhatsapp(dados.whatsapp2),
      dados.aulas || '',
      dados.quantidadeAulas || 0,
      dados.subtotal || 0,
      dados.percentualDesconto || 0,
      dados.desconto || 0,
      dados.total || 0,
      dados.metodo || '',
      linkComprovante,
      'A conferir',
    ]);

    return responder({ ok: true, comprovanteUrl: linkComprovante });
  } catch (err) {
    // O erro fica no log do script (Execuções, no editor) e a rota do site
    // devolve uma mensagem amigável com o caminho do WhatsApp.
    console.error(err);
    return responder({ ok: false, erro: String(err) });
  } finally {
    trava.releaseLock();
  }
}

/** Abrir a URL /exec no navegador cai aqui. Serve para testar a publicação. */
function doGet() {
  return responder({
    ok: true,
    mensagem: 'Webhook de inscrições da Estações está no ar. Use POST para gravar.',
  });
}

// ─────────────────────────────────────────────────────────────────────────────

function obterAba() {
  const planilha = SpreadsheetApp.openById(CONFIG.PLANILHA_ID);
  let aba = planilha.getSheetByName(CONFIG.ABA);

  if (!aba) {
    aba = planilha.insertSheet(CONFIG.ABA);
  }

  // Cabeçalho na primeira execução, já formatado e congelado.
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS);
    const cabecalho = aba.getRange(1, 1, 1, COLUNAS.length);
    cabecalho.setFontWeight('bold');
    cabecalho.setBackground('#3d1c04');
    cabecalho.setFontColor('#ffffff');
    aba.setFrozenRows(1);
    aba.setColumnWidth(9, 420); // a coluna "Aulas" é longa
    // Subtotal, desconto e total como moeda.
    aba.getRange(1, 11, aba.getMaxRows(), 1).setNumberFormat('R$ #,##0.00');
    aba.getRange(1, 13, aba.getMaxRows(), 2).setNumberFormat('R$ #,##0.00');
  }

  return aba;
}

function salvarComprovante(dados) {
  const pasta = DriveApp.getFolderById(CONFIG.PASTA_COMPROVANTES_ID);
  const extensao = extensaoDoTipo(dados.arquivo.tipo);
  const nomeArquivo = [
    dados.protocolo || 'sem-protocolo',
    (dados.nome1 || 'sem-nome').replace(/[^\w ]/g, '').trim().replace(/\s+/g, '-'),
  ].join('_') + extensao;

  const blob = Utilities.newBlob(
    Utilities.base64Decode(dados.arquivo.base64),
    dados.arquivo.tipo,
    nomeArquivo,
  );

  const arquivo = pasta.createFile(blob);
  return arquivo.getUrl();
}

function extensaoDoTipo(tipo) {
  const mapa = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/heic': '.heic',
    'application/pdf': '.pdf',
  };
  return mapa[tipo] || '';
}

/** ISO em UTC vira data e hora de Campo Grande, do jeito que se lê aqui. */
function formatarData(iso) {
  const data = iso ? new Date(iso) : new Date();
  return Utilities.formatDate(data, 'America/Campo_Grande', 'dd/MM/yyyy HH:mm');
}

/** 5567992630948 vira (67) 99263-0948, que dá para copiar e ligar. */
function formatarWhatsapp(bruto) {
  if (!bruto) return '';
  const digitos = String(bruto).replace(/\D/g, '').replace(/^55/, '');
  if (digitos.length === 11) {
    return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 7) + '-' + digitos.slice(7);
  }
  if (digitos.length === 10) {
    return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 6) + '-' + digitos.slice(6);
  }
  return String(bruto);
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Rode esta função uma vez pelo editor (botão ▷, com "testarConfiguracao"
 * selecionado) para conferir a configuração antes de publicar. Ela grava uma
 * linha de teste, que você pode apagar depois.
 */
function testarConfiguracao() {
  const aba = obterAba();
  DriveApp.getFolderById(CONFIG.PASTA_COMPROVANTES_ID); // estoura se o ID estiver errado
  aba.appendRow([
    formatarData(new Date().toISOString()),
    'EST-TESTE',
    'teste de configuração',
    'Individual',
    'Linha de teste — pode apagar',
    formatarWhatsapp('5567992630948'),
    '', '', 'nenhuma', 0, 0, 0, 0, 0, 'PIX', '', 'Teste',
  ]);
  Logger.log('Tudo certo: planilha e pasta acessíveis. Apague a linha de teste.');
}
