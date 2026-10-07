'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coffee,
  Copy,
  CreditCard,
  FileUp,
  Loader2,
  Music,
  QrCode,
  Tag,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';

import {
  AULAS,
  BAILE,
  CREDITO,
  DESCONTOS,
  EDICAO,
  PIX,
  WHATSAPP_ESCOLA,
  aplicarRegraDoBaile,
  aulaPorId,
  aulasPorDia,
  calcularOrcamento,
  ehVendavel,
  formatarReais,
  precoDe,
  vendaAntecipadaDoBaileAberta,
  type Aula,
  type EstadoDoBaile,
  type Formato,
} from '@/lib/intensivo';
import { gerarPixCopiaECola } from '@/lib/pix';

const ETAPAS = [
  { numero: 1, titulo: 'Quem vai dançar' },
  { numero: 2, titulo: 'Quais aulas' },
  { numero: 3, titulo: 'Pagamento' },
] as const;

/** Teto do arquivo enviado, igual ao da rota. */
const TAMANHO_MAXIMO = 3 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades

/** (67) 99263-0948 enquanto a pessoa digita. */
function mascararTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function telefoneValido(valor: string): boolean {
  const d = valor.replace(/\D/g, '');
  return d.length === 10 || d.length === 11;
}

/**
 * Foto de comprovante de celular chega com 4 MB e 4000px de largura. Reduzir
 * no navegador evita o limite de corpo da função e deixa a pasta do Drive
 * navegável. PDF passa direto: comprimir PDF no navegador não vale a pena.
 */
async function prepararArquivo(arquivo: File): Promise<File> {
  if (arquivo.type === 'application/pdf') return arquivo;
  if (!arquivo.type.startsWith('image/')) return arquivo;

  const bitmap = await createImageBitmap(arquivo).catch(() => null);
  if (!bitmap) return arquivo;

  const ladoMaximo = 1600;
  const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');
  if (!ctx) return arquivo;
  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.82),
  );
  if (!blob || blob.size >= arquivo.size) return arquivo;

  const nome = arquivo.name.replace(/\.[^.]+$/, '') || 'comprovante';
  return new File([blob], `${nome}.jpg`, { type: 'image/jpeg' });
}

function Campo({
  id,
  rotulo,
  valor,
  onChange,
  onBlur,
  erro,
  placeholder,
  tipo = 'text',
  autoComplete,
  inputMode,
}: {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  erro?: string;
  placeholder?: string;
  tipo?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel';
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold tracking-widest uppercase text-brown-800 mb-2">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`w-full px-5 py-4 rounded-2xl border bg-brown-50/60 text-brown-950 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:border-transparent transition-[border-color,box-shadow] ${
          erro ? 'border-red-400 focus:ring-red-400' : 'border-brown-200 focus:ring-terracotta'
        }`}
      />
      {erro && (
        <p id={`${id}-erro`} className="text-red-600 text-sm mt-1.5 flex items-center gap-1.5">
          <AlertCircle size={14} className="shrink-0" />
          {erro}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function InscricaoForm() {
  const [etapa, setEtapa] = useState(1);
  const [formato, setFormato] = useState<Formato>('individual');
  const [nome1, setNome1] = useState('');
  const [whatsapp1, setWhatsapp1] = useState('');
  const [nome2, setNome2] = useState('');
  const [whatsapp2, setWhatsapp2] = useState('');
  const [tocado, setTocado] = useState<Record<string, boolean>>({});
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [metodo, setMetodo] = useState<'pix' | 'credito'>(PIX.ativo ? 'pix' : 'credito');
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [erroArquivo, setErroArquivo] = useState('');
  const [consentimento, setConsentimento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [copiado, setCopiado] = useState(false);
  /**
   * O prazo da venda antecipada do baile depende da hora atual, que o servidor
   * e o navegador não compartilham. Começa aberto e se corrige depois da
   * montagem: assim o HTML do servidor e o da primeira renderização batem.
   */
  const [antecipadaAberta, setAntecipadaAberta] = useState(true);
  /** Se o baile entrou de brinde, e se a pessoa já o recusou uma vez. */
  const [estadoDoBaile, setEstadoDoBaile] = useState<EstadoDoBaile>({
    baileAutomatico: false,
    baileRecusado: false,
  });
  useEffect(() => {
    setAntecipadaAberta(vendaAntecipadaDoBaileAberta());
  }, []);

  const tituloEtapaRef = useRef<HTMLHeadingElement>(null);
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  const orcamento = useMemo(() => calcularOrcamento(selecionadas, formato), [selecionadas, formato]);
  const dias = useMemo(() => aulasPorDia(), []);
  /** A faixa de desconto mais baixa, para anunciar sem repetir o número à mão. */
  const primeiraFaixa = useMemo(
    () => [...DESCONTOS].sort((a, b) => a.minimoAulas - b.minimoAulas)[0],
    [],
  );

  const preco = useCallback((aula: Aula) => precoDe(aula, formato), [formato]);

  // ── PIX ───────────────────────────────────────────────────────────────────
  const payloadPix = useMemo(() => {
    if (!PIX.ativo || orcamento.total <= 0) return '';
    return gerarPixCopiaECola({
      chave: PIX.chave,
      beneficiario: PIX.nomeNoQr,
      cidade: PIX.cidade,
      valor: orcamento.total,
      identificador: protocolo || undefined,
    });
  }, [orcamento.total, protocolo]);

  useEffect(() => {
    if (!payloadPix) {
      setQrCode('');
      return;
    }
    let ativo = true;
    QRCode.toDataURL(payloadPix, {
      width: 480,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#3d1c04ff', light: '#ffffffff' },
    })
      .then((url) => {
        if (ativo) setQrCode(url);
      })
      .catch(() => {
        if (ativo) setQrCode('');
      });
    return () => {
      ativo = false;
    };
  }, [payloadPix]);

  // Prévia do comprovante sem vazar object URL.
  useEffect(() => {
    if (!comprovante || !comprovante.type.startsWith('image/')) {
      setPrevia(null);
      return;
    }
    const url = URL.createObjectURL(comprovante);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [comprovante]);

  // Troca de etapa: leva o foco para o título, senão o leitor de tela e o
  // teclado continuam no botão que sumiu.
  useEffect(() => {
    if (etapa > 1) tituloEtapaRef.current?.focus();
  }, [etapa]);

  // ── validação ─────────────────────────────────────────────────────────────
  const erros = useMemo(() => {
    const e: Record<string, string> = {};
    if (tocado.nome1 && nome1.trim().length < 3) e.nome1 = 'Escreva o nome completo.';
    if (tocado.whatsapp1 && !telefoneValido(whatsapp1)) e.whatsapp1 = 'Use DDD + número.';
    if (formato === 'dupla') {
      if (tocado.nome2 && nome2.trim().length < 3) e.nome2 = 'Escreva o nome completo.';
      if (tocado.whatsapp2 && !telefoneValido(whatsapp2)) e.whatsapp2 = 'Use DDD + número.';
    }
    return e;
  }, [tocado, nome1, whatsapp1, nome2, whatsapp2, formato]);

  const etapa1Completa =
    nome1.trim().length >= 3 &&
    telefoneValido(whatsapp1) &&
    (formato === 'individual' || (nome2.trim().length >= 3 && telefoneValido(whatsapp2)));

  const etapa2Completa = selecionadas.length > 0;

  const precisaComprovante = metodo === 'pix';
  const etapa3Completa =
    consentimento && (!precisaComprovante || Boolean(comprovante)) && !erroArquivo;

  // ── ações ─────────────────────────────────────────────────────────────────
  function avancar() {
    if (etapa === 1) {
      setTocado({ nome1: true, whatsapp1: true, nome2: true, whatsapp2: true });
      if (!etapa1Completa) return;
    }
    if (etapa === 2 && !etapa2Completa) return;
    setEtapa((n) => Math.min(3, n + 1));
  }

  /** A regra mora em lib/intensivo.ts; aqui só se liga ao estado. */
  function aplicarSelecao(proximas: string[], mexeuNoBaile = false) {
    const resultado = aplicarRegraDoBaile(proximas, {
      ...estadoDoBaile,
      mexeuNoBaile,
      vendaAberta: antecipadaAberta,
    });
    setSelecionadas(resultado.selecao);
    setEstadoDoBaile({
      baileAutomatico: resultado.baileAutomatico,
      baileRecusado: resultado.baileRecusado,
    });
  }

  function alternarAula(id: string) {
    const aula = aulaPorId(id);
    const proximas = selecionadas.includes(id)
      ? selecionadas.filter((x) => x !== id)
      : [...selecionadas, id];
    aplicarSelecao(proximas, Boolean(aula?.evento));
  }

  function alternarDia(aulasDoDia: Aula[]) {
    const ids = aulasDoDia.filter(ehVendavel).map((a) => a.id);
    const todasMarcadas = ids.every((id) => selecionadas.includes(id));
    const proximas = todasMarcadas
      ? selecionadas.filter((id) => !ids.includes(id))
      : [...new Set([...selecionadas, ...ids])];
    // "Marcar tudo" num dia não é a pessoa mexendo no baile de propósito.
    aplicarSelecao(proximas);
  }

  async function escolherArquivo(arquivo: File | null) {
    setErroArquivo('');
    if (!arquivo) {
      setComprovante(null);
      return;
    }
    const aceito =
      arquivo.type.startsWith('image/') || arquivo.type === 'application/pdf';
    if (!aceito) {
      setErroArquivo('Manda uma imagem (JPG, PNG) ou um PDF.');
      setComprovante(null);
      return;
    }
    const preparado = await prepararArquivo(arquivo);
    if (preparado.size > TAMANHO_MAXIMO) {
      setErroArquivo('O arquivo passou de 3 MB mesmo depois de reduzir. Tenta um print da tela.');
      setComprovante(null);
      return;
    }
    setComprovante(preparado);
  }

  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(payloadPix);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setErroEnvio('Não deu para copiar automaticamente. Selecione o código e copie à mão.');
    }
  }

  /** Mesmos dados, caminho manual: é a rede de segurança se a planilha cair. */
  const linkWhatsapp = useMemo(() => {
    const linhas = [
      `Oi! Quero garantir minha vaga no ${EDICAO.nome}.`,
      '',
      `Formato: ${formato === 'dupla' ? 'Dupla' : 'Individual'}`,
      `Nome: ${nome1 || '(preencher)'}`,
      `WhatsApp: ${whatsapp1 || '(preencher)'}`,
    ];
    if (formato === 'dupla') {
      linhas.push(`Nome 2: ${nome2 || '(preencher)'}`, `WhatsApp 2: ${whatsapp2 || '(preencher)'}`);
    }
    const nomes = selecionadas
      .map((id) => AULAS.find((a) => a.id === id))
      .filter((a): a is Aula => Boolean(a))
      .map((a) => `- ${a.dia}/${a.mes} ${a.horario} — ${a.nome}`);
    if (nomes.length) linhas.push('', 'Aulas:', ...nomes);
    linhas.push('', `Total: ${formatarReais(orcamento.total)}`);
    if (protocolo) linhas.push(`Protocolo: ${protocolo}`);
    return `https://wa.me/${WHATSAPP_ESCOLA}?text=${encodeURIComponent(linhas.join('\n'))}`;
  }, [formato, nome1, whatsapp1, nome2, whatsapp2, selecionadas, orcamento.total, protocolo]);

  async function enviar() {
    setErroEnvio('');
    if (!etapa3Completa) return;
    setEnviando(true);

    const corpo = new FormData();
    corpo.set('formato', formato);
    corpo.set('nome1', nome1);
    corpo.set('whatsapp1', whatsapp1);
    corpo.set('nome2', nome2);
    corpo.set('whatsapp2', whatsapp2);
    corpo.set('aulas', JSON.stringify(selecionadas));
    corpo.set('metodo', metodo);
    corpo.set('consentimento', String(consentimento));
    if (comprovante) corpo.set('comprovante', comprovante);

    try {
      const resposta = await fetch('/api/inscricao', { method: 'POST', body: corpo });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok || !dados.ok) {
        setErroEnvio(dados.erro ?? 'Não conseguimos enviar agora. Tenta pelo WhatsApp?');
        return;
      }
      setProtocolo(dados.protocolo);
    } catch {
      setErroEnvio('Sua conexão caiu no meio do envio. Tenta de novo ou manda pelo WhatsApp.');
    } finally {
      setEnviando(false);
    }
  }

  // ── sucesso ───────────────────────────────────────────────────────────────
  if (protocolo) {
    return (
      <div className="max-w-2xl mx-auto my-10 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.25)] border border-black/5 p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#682c0b] mb-3">
            Inscrição recebida!
          </h2>
          <p className="text-brown-700 text-lg mb-8 max-w-md mx-auto">
            Vamos conferir o pagamento e te chamar no WhatsApp para confirmar. Guarde o número do
            seu protocolo.
          </p>

          <div className="inline-flex flex-col items-center gap-1 bg-brown-50 border border-brown-200 rounded-2xl px-8 py-5 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brown-600">
              Protocolo
            </span>
            <span className="text-2xl font-display font-bold text-[#682c0b] tabular-nums tracking-wide">
              {protocolo}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={linkWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold hover:bg-terracotta"
            >
              Avisar no WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                setProtocolo('');
                setSelecionadas([]);
                setComprovante(null);
                setConsentimento(false);
                setNome2('');
                setWhatsapp2('');
                setEtapa(1);
              }}
              className="pressable inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-brown-800 border-2 border-brown-200 hover:bg-brown-50"
            >
              Fazer outra inscrição
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── formulário ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto my-10 px-4 md:px-0">
      <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.25)] border border-black/5 overflow-hidden">
        {/* Trilha de etapas */}
        <div className="px-6 md:px-12 pt-8 pb-6 border-b border-brown-100">
          <ol className="flex items-center gap-2 md:gap-3">
            {ETAPAS.map((e, i) => {
              const concluida = etapa > e.numero;
              const atual = etapa === e.numero;
              return (
                <li
                  key={e.numero}
                  // A etapa atual não encolhe: é o único rótulo visível no
                  // celular, e cortá-lo em "Quem…" tiraria a informação útil.
                  className={`flex items-center gap-2 md:gap-3 min-w-0 ${
                    atual ? 'shrink-0' : 'flex-1 last:flex-none'
                  }`}
                >
                  {/* O desenho é decorativo; quem usa leitor de tela ouve esta frase. */}
                  <span className="sr-only">
                    Etapa {e.numero} de 3{atual ? ', atual' : concluida ? ', concluída' : ''}:{' '}
                    {e.titulo}
                  </span>

                  <div aria-hidden className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-7 h-7 shrink-0 rounded-full grid place-items-center text-xs font-bold transition-[background-color,color] ${
                        concluida
                          ? 'bg-[#682c0b] text-orange-50'
                          : atual
                            ? 'bg-[#fbbf24] text-[#682c0b]'
                            : 'bg-brown-100 text-brown-500'
                      }`}
                    >
                      {concluida ? <Check size={14} strokeWidth={3} /> : e.numero}
                    </span>
                    {/* No celular não cabem três rótulos: só o da etapa atual aparece. */}
                    <span
                      className={`text-xs md:text-sm font-bold truncate transition-colors ${
                        atual ? 'text-[#682c0b]' : 'text-brown-500 hidden sm:inline'
                      }`}
                    >
                      {e.titulo}
                    </span>
                  </div>

                  {i < ETAPAS.length - 1 && (
                    <span
                      aria-hidden
                      className={`h-px flex-1 min-w-2 transition-colors ${
                        concluida ? 'bg-[#682c0b]' : 'bg-brown-200'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="px-6 md:px-12 py-8">
          <AnimatePresence mode="wait" initial={false}>
            {/* ── Etapa 1 ────────────────────────────────────────────────── */}
            {etapa === 1 && (
              <motion.div
                key="etapa-1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.24 }}
              >
                <h2
                  ref={tituloEtapaRef}
                  tabIndex={-1}
                  className="text-2xl md:text-3xl font-display font-bold text-[#682c0b] mb-2 outline-none"
                >
                  Quem vai dançar?
                </h2>
                <p className="text-brown-700 mb-7">
                  Em dupla sai mais barato por pessoa. Mas não precisa levar par para as aulas — a
                  gente faz rodízio.
                </p>

                <fieldset className="mb-7">
                  <legend className="text-xs font-bold tracking-widest uppercase text-brown-800 mb-3">
                    Formato da inscrição
                  </legend>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { valor: 'individual', rotulo: 'Sozinho(a)', icone: User },
                      { valor: 'dupla', rotulo: 'Em dupla', icone: Users },
                    ] as const).map(({ valor, rotulo, icone: Icone }) => {
                      const ativo = formato === valor;
                      return (
                        <label
                          key={valor}
                          className={`pressable-lg relative flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border-2 cursor-pointer text-center ${
                            ativo
                              ? 'border-[#fbbf24] bg-[#fffbeb]'
                              : 'border-brown-200 bg-brown-50/40 hover:border-brown-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="formato"
                            value={valor}
                            checked={ativo}
                            onChange={() => setFormato(valor)}
                            className="sr-only"
                          />
                          <Icone
                            size={26}
                            className={ativo ? 'text-orange-600' : 'text-brown-400'}
                          />
                          <span
                            className={`font-bold ${ativo ? 'text-[#682c0b]' : 'text-brown-700'}`}
                          >
                            {rotulo}
                          </span>
                          {ativo && (
                            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#fbbf24] grid place-items-center">
                              <Check size={12} strokeWidth={3} className="text-[#682c0b]" />
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-5">
                  <Campo
                    id="nome1"
                    rotulo={formato === 'dupla' ? 'Nome da 1ª pessoa' : 'Nome completo'}
                    valor={nome1}
                    onChange={setNome1}
                    onBlur={() => setTocado((t) => ({ ...t, nome1: true }))}
                    erro={erros.nome1}
                    placeholder="Como você quer ser chamado(a)"
                    autoComplete="name"
                  />
                  <Campo
                    id="whatsapp1"
                    rotulo="WhatsApp"
                    valor={whatsapp1}
                    onChange={(v) => setWhatsapp1(mascararTelefone(v))}
                    onBlur={() => setTocado((t) => ({ ...t, whatsapp1: true }))}
                    erro={erros.whatsapp1}
                    placeholder="(67) 99263-0948"
                    tipo="tel"
                    inputMode="tel"
                    autoComplete="tel"
                  />

                  <AnimatePresence initial={false}>
                    {formato === 'dupla' && (
                      <motion.div
                        key="segunda-pessoa"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 pt-5 border-t border-dashed border-brown-200">
                          <Campo
                            id="nome2"
                            rotulo="Nome da 2ª pessoa"
                            valor={nome2}
                            onChange={setNome2}
                            onBlur={() => setTocado((t) => ({ ...t, nome2: true }))}
                            erro={erros.nome2}
                            placeholder="Quem vem com você"
                          />
                          <Campo
                            id="whatsapp2"
                            rotulo="WhatsApp da 2ª pessoa"
                            valor={whatsapp2}
                            onChange={(v) => setWhatsapp2(mascararTelefone(v))}
                            onBlur={() => setTocado((t) => ({ ...t, whatsapp2: true }))}
                            erro={erros.whatsapp2}
                            placeholder="(67) 90000-0000"
                            tipo="tel"
                            inputMode="tel"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── Etapa 2 ────────────────────────────────────────────────── */}
            {etapa === 2 && (
              <motion.div
                key="etapa-2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.24 }}
              >
                <h2
                  ref={tituloEtapaRef}
                  tabIndex={-1}
                  className="text-2xl md:text-3xl font-display font-bold text-[#682c0b] mb-2 outline-none"
                >
                  Quais aulas você vai fazer?
                </h2>
                <p className="text-brown-700 mb-4">
                  Monte do seu jeito.
                  {primeiraFaixa
                    ? ` A partir de ${primeiraFaixa.minimoAulas} aulas o desconto entra automático.`
                    : ''}
                </p>

                <p className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-[#fffbeb] border border-[#fcd34d] text-[#92400e] text-xs font-bold">
                  <Tag size={13} />
                  {orcamento.lote.nome} · {formatarReais(orcamento.lote.porAula)} por aula
                  <span className="font-medium text-[#a16207]">
                    ({formatarReais(orcamento.lote.porAulaDupla)} a dupla)
                  </span>
                </p>

                <div className="space-y-5">
                  {dias.map((dia) => {
                    const ids = dia.aulas.map((a) => a.id);
                    const todas = ids.every((id) => selecionadas.includes(id));
                    return (
                      <div
                        key={`${dia.dia}-${dia.mes}`}
                        className="rounded-2xl border border-brown-200 overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-brown-50/70 border-b border-brown-200">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="bg-[#682c0b] text-orange-50 px-2.5 py-1.5 rounded-xl text-center shrink-0">
                              <span className="block text-lg font-display font-bold leading-none tabular-nums">
                                {dia.dia}
                              </span>
                              <span className="block text-[9px] uppercase tracking-wider font-bold mt-0.5 text-orange-200">
                                {dia.mes}
                              </span>
                            </div>
                            <span className="font-bold text-[#682c0b] whitespace-nowrap">
                              {dia.diaSemana}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alternarDia(dia.aulas)}
                            className="pressable text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-700 hover:text-[#682c0b] shrink-0 px-2 py-1.5 rounded-lg hover:bg-orange-50 whitespace-nowrap"
                          >
                            {/* No celular o rótulo longo espremia o nome do dia. */}
                            {todas ? 'Limpar' : 'Marcar'}
                            <span className="hidden sm:inline">{todas ? ' dia' : ' tudo'}</span>
                          </button>
                        </div>

                        <div className="divide-y divide-brown-100">
                          {dia.aulas.map((aula) => {
                            // Intervalo mostra o ritmo do dia, mas não se vende.
                            if (aula.intervalo) {
                              return (
                                <div
                                  key={aula.id}
                                  className="flex items-center gap-3 px-4 py-2.5 bg-brown-50/40"
                                >
                                  <span aria-hidden className="w-5 shrink-0 grid place-items-center">
                                    <Coffee size={14} className="text-brown-400" />
                                  </span>
                                  <span className="flex-1 min-w-0 text-sm text-brown-600">
                                    <span className="font-medium">{aula.nome}</span>
                                    <span className="tabular-nums"> · {aula.horario}</span>
                                  </span>
                                  <span className="text-xs text-brown-500 shrink-0">incluso</span>
                                </div>
                              );
                            }

                            // Passado o prazo, a entrada do baile só na portaria:
                            // o formulário para de vender o que não pode cumprir.
                            if (aula.evento && !antecipadaAberta) {
                              return (
                                <div
                                  key={aula.id}
                                  className="flex items-center gap-3 px-4 py-3.5 bg-brown-50/40"
                                >
                                  <span aria-hidden className="w-5 shrink-0 grid place-items-center">
                                    <Music size={14} className="text-brown-400" />
                                  </span>
                                  <span className="flex-1 min-w-0">
                                    <span className="font-bold text-brown-600">{aula.nome}</span>
                                    <span className="block text-xs text-brown-600 mt-0.5">
                                      A venda antecipada fechou. Entrada na portaria.
                                    </span>
                                  </span>
                                  <span className="font-display font-bold text-brown-700 shrink-0 tabular-nums">
                                    {formatarReais(BAILE.naHora)}
                                  </span>
                                </div>
                              );
                            }

                            const marcada = selecionadas.includes(aula.id);
                            return (
                              <label
                                key={aula.id}
                                className={`pressable-lg flex items-center gap-3 px-4 py-3.5 cursor-pointer ${
                                  marcada ? 'bg-[#fffbeb]' : 'bg-white hover:bg-brown-50/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={marcada}
                                  onChange={() => alternarAula(aula.id)}
                                  className="sr-only"
                                />
                                <span
                                  aria-hidden
                                  className={`w-5 h-5 shrink-0 rounded-md border-2 grid place-items-center transition-[background-color,border-color] ${
                                    marcada
                                      ? 'bg-[#682c0b] border-[#682c0b]'
                                      : 'border-brown-300 bg-white'
                                  }`}
                                >
                                  {marcada && (
                                    <Check size={13} strokeWidth={3} className="text-orange-50" />
                                  )}
                                </span>

                                <span className="flex-1 min-w-0">
                                  <span className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-[#682c0b]">{aula.nome}</span>
                                    {aula.evento ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-[9px] font-bold rounded uppercase tracking-wider">
                                        <Music size={9} /> Baile
                                      </span>
                                    ) : (
                                      <span
                                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                                          aula.nivel === 'Do Zero'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}
                                      >
                                        {aula.nivel}
                                      </span>
                                    )}
                                  </span>
                                  <span className="block text-xs text-brown-600 mt-0.5 tabular-nums">
                                    {aula.horario}
                                    {aula.descricao ? ` · ${aula.descricao}` : ''}
                                  </span>
                                  {aula.evento && (
                                    <span className="block text-xs text-brown-500 mt-0.5">
                                      {formatarReais(BAILE.naHora)} na portaria · antecipado só até
                                      1h antes
                                    </span>
                                  )}
                                </span>

                                <span className="font-display font-bold shrink-0 tabular-nums text-right">
                                  {aula.evento && orcamento.baileDeBrinde ? (
                                    <>
                                      <span className="block text-brown-400 line-through text-sm font-body font-medium">
                                        {formatarReais(preco(aula))}
                                      </span>
                                      <span className="block text-green-700 text-sm">grátis</span>
                                    </>
                                  ) : (
                                    <span className="text-[#682c0b]">{formatarReais(preco(aula))}</span>
                                  )}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div
                  aria-live="polite"
                  className="mt-6 rounded-2xl bg-[#3d1c04] text-orange-50 px-5 py-4"
                >
                  {selecionadas.length === 0 ? (
                    <p className="text-orange-200 text-sm text-center py-1">
                      Marque as aulas para ver o valor.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm text-orange-200">
                        <span>
                          {orcamento.quantidadeAulas}{' '}
                          {orcamento.quantidadeAulas === 1 ? 'aula' : 'aulas'}
                          {formato === 'dupla' ? ' · preço de dupla' : ''}
                        </span>
                        <span className="tabular-nums">{formatarReais(orcamento.subtotalAulas)}</span>
                      </div>

                      {orcamento.desconto > 0 && (
                        <div className="flex justify-between text-sm text-[#fbbf24] font-bold">
                          <span>Desconto de {orcamento.percentualDesconto}%</span>
                          <span className="tabular-nums">− {formatarReais(orcamento.desconto)}</span>
                        </div>
                      )}

                      {orcamento.baileEscolhido && (
                        <div
                          className={`flex justify-between text-sm ${
                            orcamento.baileDeBrinde ? 'text-[#fbbf24] font-bold' : 'text-orange-200'
                          }`}
                        >
                          <span>Baile de Halloween</span>
                          <span className="tabular-nums">
                            {orcamento.baileDeBrinde
                              ? 'incluso'
                              : formatarReais(orcamento.subtotalBaile)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-baseline pt-2 border-t border-white/15">
                        <span className="font-bold">Total</span>
                        <span className="text-2xl font-display font-bold text-[#fbbf24] tabular-nums">
                          {formatarReais(orcamento.total)}
                        </span>
                      </div>

                      {/* Quem está a uma aula da próxima faixa merece saber. */}
                      {orcamento.proximaFaixa && (
                        <p className="text-xs text-orange-200/90 pt-2 border-t border-white/10 mt-2">
                          {orcamento.proximaFaixa.faltam === 1 ? 'Falta 1 aula' : `Faltam ${orcamento.proximaFaixa.faltam} aulas`}{' '}
                          para{' '}
                          {orcamento.proximaFaixa.percentual}% de desconto
                          {orcamento.proximaFaixa.incluiBaile ? ' e o baile de graça' : ''}.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Etapa 3 ────────────────────────────────────────────────── */}
            {etapa === 3 && (
              <motion.div
                key="etapa-3"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.24 }}
              >
                <h2
                  ref={tituloEtapaRef}
                  tabIndex={-1}
                  className="text-2xl md:text-3xl font-display font-bold text-[#682c0b] mb-2 outline-none"
                >
                  Pagamento
                </h2>
                <p className="text-brown-700 mb-6">
                  {formato === 'dupla' ? 'Dupla' : 'Inscrição individual'} ·{' '}
                  {selecionadas.length} {selecionadas.length === 1 ? 'item' : 'itens'} ·{' '}
                  <strong className="text-[#682c0b]">{formatarReais(orcamento.total)}</strong>
                </p>

                {/* Escolha do método */}
                {PIX.ativo && CREDITO.ativo && (
                  <div
                    role="tablist"
                    aria-label="Forma de pagamento"
                    className="flex gap-2 p-1 bg-brown-100 rounded-2xl mb-6"
                  >
                    {([
                      { valor: 'pix', rotulo: 'PIX', icone: QrCode },
                      { valor: 'credito', rotulo: 'Crédito', icone: CreditCard },
                    ] as const).map(({ valor, rotulo, icone: Icone }) => (
                      <button
                        key={valor}
                        type="button"
                        role="tab"
                        aria-selected={metodo === valor}
                        onClick={() => setMetodo(valor)}
                        className={`pressable flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm ${
                          metodo === valor
                            ? 'bg-white text-[#682c0b] shadow-sm'
                            : 'text-brown-600 hover:text-[#682c0b]'
                        }`}
                      >
                        <Icone size={16} /> {rotulo}
                      </button>
                    ))}
                  </div>
                )}

                {/* PIX */}
                {metodo === 'pix' && (
                  <div className="rounded-2xl border border-brown-200 overflow-hidden mb-6">
                    <div className="px-5 py-4 bg-brown-50/70 border-b border-brown-200">
                      <h3 className="font-bold text-[#682c0b]">Pague com PIX</h3>
                      <p className="text-sm text-brown-700 mt-0.5">
                        O valor já vai preenchido. Depois é só anexar o comprovante aqui embaixo.
                      </p>
                    </div>

                    <div className="p-5 flex flex-col md:flex-row gap-5 items-center md:items-start">
                      {qrCode ? (
                        <Image
                          src={qrCode}
                          alt={`QR Code do PIX no valor de ${formatarReais(orcamento.total)}`}
                          width={160}
                          height={160}
                          unoptimized
                          className="rounded-xl border border-brown-200 shrink-0"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-xl border border-brown-200 bg-brown-50 grid place-items-center shrink-0">
                          <Loader2 className="animate-spin text-brown-400" size={22} />
                        </div>
                      )}

                      <div className="flex-1 w-full min-w-0">
                        <dl className="text-sm mb-4 space-y-1">
                          <div className="flex gap-2">
                            <dt className="text-brown-600 shrink-0">Chave:</dt>
                            <dd className="font-bold text-[#682c0b] truncate">{PIX.chave}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="text-brown-600 shrink-0">Nome:</dt>
                            <dd className="font-bold text-[#682c0b] truncate">
                              {PIX.beneficiario}
                            </dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="text-brown-600 shrink-0">Valor:</dt>
                            <dd className="font-bold text-[#682c0b] tabular-nums">
                              {formatarReais(orcamento.total)}
                            </dd>
                          </div>
                        </dl>

                        <button
                          type="button"
                          onClick={copiarPix}
                          className="pressable w-full flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-4 py-3.5 rounded-xl font-bold hover:bg-terracotta"
                        >
                          {copiado ? (
                            <>
                              <Check size={17} /> Código copiado
                            </>
                          ) : (
                            <>
                              <Copy size={17} /> Copiar código PIX
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Crédito */}
                {metodo === 'credito' && CREDITO.ativo && (
                  <div className="rounded-2xl border border-brown-200 overflow-hidden mb-6">
                    <div className="px-5 py-4 bg-brown-50/70 border-b border-brown-200">
                      <h3 className="font-bold text-[#682c0b]">Pague no crédito</h3>
                      <p className="text-sm text-brown-700 mt-0.5">
                        Abre a página segura da {CREDITO.operadora}. Digite{' '}
                        <strong>{formatarReais(orcamento.total)}</strong> e volte aqui para anexar o
                        recibo.
                      </p>
                    </div>
                    <div className="p-5">
                      <a
                        href={CREDITO.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pressable w-full flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-4 py-3.5 rounded-xl font-bold hover:bg-terracotta"
                      >
                        <CreditCard size={17} /> Pagar {formatarReais(orcamento.total)}
                      </a>
                      {CREDITO.observacao && (
                        <p className="text-xs text-brown-600 mt-3 text-center">
                          {CREDITO.observacao}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Comprovante */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-brown-800 mb-2">
                    Comprovante {metodo === 'pix' ? '' : '(opcional)'}
                  </h3>

                  {comprovante ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl border border-green-200 bg-green-50">
                      {previa ? (
                        <Image
                          src={previa}
                          alt="Prévia do comprovante enviado"
                          width={48}
                          height={48}
                          unoptimized
                          className="w-12 h-12 rounded-lg object-cover border border-green-200 shrink-0"
                        />
                      ) : (
                        <span className="w-12 h-12 rounded-lg bg-white border border-green-200 grid place-items-center shrink-0">
                          <FileUp size={18} className="text-green-700" />
                        </span>
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-green-900 text-sm truncate">
                          {comprovante.name}
                        </span>
                        <span className="block text-xs text-green-700 tabular-nums">
                          {(comprovante.size / 1024).toFixed(0)} KB
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setComprovante(null);
                          if (inputArquivoRef.current) inputArquivoRef.current.value = '';
                        }}
                        aria-label="Remover comprovante"
                        className="pressable-sm p-2 rounded-lg text-green-800 hover:bg-green-100 shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`pressable-lg flex flex-col items-center gap-2 px-5 py-8 rounded-2xl border-2 border-dashed cursor-pointer text-center ${
                        erroArquivo
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-brown-300 bg-brown-50/40 hover:border-[#fbbf24] hover:bg-[#fffbeb]'
                      }`}
                    >
                      <input
                        ref={inputArquivoRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => void escolherArquivo(e.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                      <FileUp size={24} className="text-brown-500" />
                      <span className="font-bold text-[#682c0b] text-sm">
                        Toque para anexar o comprovante
                      </span>
                      <span className="text-xs text-brown-600">
                        Print, foto ou PDF. A gente reduz o tamanho sozinho.
                      </span>
                    </label>
                  )}

                  {erroArquivo && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
                      <AlertCircle size={14} className="shrink-0" />
                      {erroArquivo}
                    </p>
                  )}
                </div>

                {/* Consentimento */}
                <label className="flex items-start gap-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={consentimento}
                    onChange={(e) => setConsentimento(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`w-5 h-5 shrink-0 mt-0.5 rounded-md border-2 grid place-items-center transition-[background-color,border-color] ${
                      consentimento ? 'bg-[#682c0b] border-[#682c0b]' : 'border-brown-300 bg-white'
                    }`}
                  >
                    {consentimento && <Check size={13} strokeWidth={3} className="text-orange-50" />}
                  </span>
                  <span className="text-sm text-brown-700 leading-snug">
                    Autorizo a Estações a guardar meus dados e meu comprovante para confirmar a
                    inscrição e falar comigo no WhatsApp, conforme a{' '}
                    <a
                      href="/politica-de-privacidade"
                      target="_blank"
                      className="font-bold text-orange-700 underline underline-offset-2 hover:text-[#682c0b]"
                    >
                      política de privacidade
                    </a>
                    .
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Erro de envio */}
          {erroEnvio && (
            <div
              role="alert"
              className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3"
            >
              <X size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-red-800 text-sm font-medium">{erroEnvio}</p>
                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm font-bold text-red-900 underline underline-offset-2"
                >
                  Enviar meus dados pelo WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-brown-100">
            {etapa > 1 && (
              <button
                type="button"
                onClick={() => setEtapa((n) => n - 1)}
                className="pressable inline-flex items-center gap-2 px-5 py-4 rounded-2xl font-bold text-brown-800 border-2 border-brown-200 hover:bg-brown-50 shrink-0"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Voltar</span>
              </button>
            )}

            {etapa < 3 ? (
              <button
                type="button"
                onClick={avancar}
                disabled={etapa === 2 && !etapa2Completa}
                className="pressable flex-1 inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold tracking-wide hover:bg-terracotta disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void enviar()}
                disabled={!etapa3Completa || enviando}
                className="pressable flex-1 inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold tracking-wide hover:bg-terracotta disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Enviando…
                  </>
                ) : (
                  <>
                    Garantir minha vaga <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-orange-200/80 mt-5">
        Vagas limitadas. Dúvida?{' '}
        <a
          href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${encodeURIComponent(`Oi! Tenho uma dúvida sobre o ${EDICAO.nome}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#fbbf24] underline underline-offset-2"
        >
          Fala com a gente no WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
