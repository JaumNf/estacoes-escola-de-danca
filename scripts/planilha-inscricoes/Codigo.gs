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

/**
 * Uma coluna por campo, como na planilha de respostas de um formulário Google.
 * A ordem aqui manda: é ela que monta o cabeçalho e a linha.
 * Se você mexer nesta lista, apague o cabeçalho antigo da planilha para o
 * script criar o novo — senão os valores entram em colunas trocadas.
 */
const COLUNAS = [
  'Recebido em',
  'Protocolo',
  'Edição',
  'Lote',
  'Formato',
  'Nome 1',
  'WhatsApp 1',
  'Nome 2',
  'WhatsApp 2',
  'Aulas',
  'Qtd. aulas',
  'Baile',
  'Subtotal aulas',
  'Baile (R$)',
  'Desconto %',
  'Desconto',
  'Taxa cartão',
  'Total pago',
  'Pagamento',
  'Comprovante',
  'Transação',
  'Recibo',
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

    // Confirmação de pagamento: não cria linha, acha a que já existe pelo
    // protocolo e muda o status.
    if (dados.acao === 'confirmarPagamento') {
      return confirmarPagamento(dados);
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
      dados.lote || '',
      dados.formato || '',
      dados.nome1 || '',
      formatarWhatsapp(dados.whatsapp1),
      dados.nome2 || '',
      formatarWhatsapp(dados.whatsapp2),
      dados.aulas || '',
      dados.quantidadeAulas || 0,
      dados.baile || '',
      dados.subtotalAulas || 0,
      dados.subtotalBaile || 0,
      dados.percentualDesconto || 0,
      dados.desconto || 0,
      dados.taxaCartao || 0,
      dados.total || 0,
      dados.metodo || '',
      linkComprovante,
      '',
      '',
      dados.status || 'A conferir',
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

/**
 * Marca uma inscrição como paga. Procura a linha pelo protocolo — que é o
 * mesmo `order_nsu` mandado à InfinitePay — e atualiza o status.
 *
 * Não cria linha nova: se o protocolo não existir, é sinal de problema e vale
 * mais devolver erro do que inventar um registro.
 */
function confirmarPagamento(dados) {
  const aba = obterAba();
  const protocolo = String(dados.protocolo || '').trim();
  if (!protocolo) return responder({ ok: false, erro: 'sem protocolo' });

  const colProtocolo = COLUNAS.indexOf('Protocolo') + 1;
  const ultima = aba.getLastRow();
  if (ultima < 2) return responder({ ok: false, erro: 'planilha vazia' });

  const protocolos = aba.getRange(2, colProtocolo, ultima - 1, 1).getValues();
  let linha = -1;
  for (let i = 0; i < protocolos.length; i++) {
    if (String(protocolos[i][0]).trim() === protocolo) {
      linha = i + 2;
      break;
    }
  }
  if (linha < 0) return responder({ ok: false, erro: 'protocolo não encontrado: ' + protocolo });

  const definir = function (nomeDaColuna, valor) {
    const col = COLUNAS.indexOf(nomeDaColuna) + 1;
    if (col > 0) aba.getRange(linha, col).setValue(valor);
  };

  definir('Status', 'Pago');
  definir('Pagamento', dados.formaConfirmada || '');
  definir('Transação', dados.transacao || '');
  definir('Recibo', dados.reciboUrl || '');
  if (dados.valorPago) definir('Total pago', dados.valorPago);

  // Verde na linha inteira: dá para ver o que já entrou sem ler coluna.
  aba.getRange(linha, 1, 1, COLUNAS.length).setBackground('#e8f5e9');

  return responder({ ok: true, linha: linha });
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
    aba.setColumnWidth(COLUNAS.indexOf('Aulas') + 1, 420); // essa coluna é longa
    // As colunas de dinheiro saem como moeda, para somar direto na planilha.
    ['Subtotal aulas', 'Baile (R$)', 'Desconto', 'Taxa cartão', 'Total pago'].forEach(function (nome) {
      aba.getRange(1, COLUNAS.indexOf(nome) + 1, aba.getMaxRows(), 1)
        .setNumberFormat('R$ #,##0.00');
    });
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
  const linha = COLUNAS.map(function () { return ''; });
  linha[COLUNAS.indexOf('Recebido em')] = formatarData(new Date().toISOString());
  linha[COLUNAS.indexOf('Protocolo')] = 'EST-TESTE';
  linha[COLUNAS.indexOf('Edição')] = 'teste de configuração';
  linha[COLUNAS.indexOf('Nome 1')] = 'Linha de teste — pode apagar';
  linha[COLUNAS.indexOf('WhatsApp 1')] = formatarWhatsapp('5567992630948');
  linha[COLUNAS.indexOf('Status')] = 'Teste';
  aba.appendRow(linha);
  Logger.log('Tudo certo: planilha e pasta acessíveis. Apague a linha de teste.');
}
