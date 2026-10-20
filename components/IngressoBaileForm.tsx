'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import {
  AlertCircle,
  Check,
  Copy,
  CreditCard,
  Loader2,
  MessageCircle,
  Paperclip,
  Smartphone,
  Ticket,
  Trash2,
  User,
  Users,
} from 'lucide-react';

import {
  BAILE,
  economiaDaDupla,
  precoDoIngresso,
  vendaAntecipadaAberta,
} from '@/lib/baile';
import {
  formatarReais,
  formatarTelefone,
  telefoneValido,
  type Formato,
} from '@/lib/comum';
import { CHECKOUT, PIX, WHATSAPP_ESCOLA } from '@/lib/intensivo';
import { gerarPixCopiaECola } from '@/lib/pix';

/**
 * Compra do ingresso do baile.
 *
 * É de propósito mais curto que o formulário do intensivo: aqui não há aulas
 * para escolher, nem lote, nem desconto por quantidade — um ingresso, para uma
 * pessoa ou para duas.
 *
 * O preço mostrado aqui é informativo. **Quem cobra é o servidor**, em
 * `/api/baile`, que recalcula a partir de `lib/baile.ts` e ignora o que este
 * formulário mandar. Não existe campo de total nesta requisição.
 *
 * DOIS CAMINHOS DE PAGAMENTO, e os dois chegam na mesma planilha:
 *
 *   • Checkout — a pessoa paga na página da InfinitePay, no PIX ou no cartão,
 *     e a confirmação chega sozinha pelo webhook. A linha nasce "Aguardando
 *     pagamento" e vira "Pago" sem ninguém tocar.
 *
 *   • PIX com comprovante — a pessoa copia o código, paga no banco dela e
 *     anexa o print aqui. A linha nasce "A conferir", e aí ALGUÉM DA ESCOLA
 *     precisa abrir o comprovante e confirmar. É o caminho de quem prefere
 *     pagar direto na conta, e ele custa trabalho humano: não é o padrão.
 */

/** Um passo do formulário, só para dar nome ao estado de envio. */
type Situacao = 'preenchendo' | 'enviando' | 'erro' | 'recebido';

/** Como a pessoa escolheu pagar. */
type Metodo = 'checkout' | 'pix';

/** Teto do arquivo depois da compressão, igual ao da rota. */
const TAMANHO_MAXIMO = 3 * 1024 * 1024;

const TIPOS_ACEITOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
] as const;

/**
 * Foto de comprovante de celular chega com 4 MB e 4000px de largura. Reduzir
 * no navegador evita o limite de corpo da função e deixa a pasta do Drive
 * navegável. PDF passa direto: comprimir PDF no navegador não vale a pena.
 *
 * É a mesma função do formulário do intensivo, e pela mesma razão.
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

export default function IngressoBaileForm() {
  const [formato, setFormato] = useState<Formato>('individual');
  const [nome1, setNome1] = useState('');
  const [nome2, setNome2] = useState('');
  const [whatsapp1, setWhatsapp1] = useState('');
  const [consentimento, setConsentimento] = useState(false);

  const [situacao, setSituacao] = useState<Situacao>('preenchendo');
  const [erro, setErro] = useState('');
  const [tocado, setTocado] = useState({ nome1: false, nome2: false, whatsapp1: false });

  // ── Pagamento ─────────────────────────────────────────────────────────────
  const checkoutDisponivel = CHECKOUT.ativo && Boolean(CHECKOUT.handle);
  const pixDisponivel = PIX.ativo && Boolean(PIX.chave);

  /**
   * O padrão é o checkout, quando ele existe: é o caminho que se confirma
   * sozinho e não gasta o sábado de ninguém conferindo print.
   */
  const [metodo, setMetodo] = useState<Metodo>(checkoutDisponivel ? 'checkout' : 'pix');
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [erroArquivo, setErroArquivo] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [protocolo, setProtocolo] = useState('');

  /**
   * O prazo depende da hora atual, que o servidor e o navegador não
   * compartilham. Começa aberto e se corrige depois da montagem: assim o HTML
   * do servidor e o da primeira renderização batem, sem erro de hidratação.
   *
   * Quem burlar isto não consegue nada: `/api/baile` confere o prazo de novo.
   */
  const [vendaAberta, setVendaAberta] = useState(true);
  useEffect(() => {
    setVendaAberta(vendaAntecipadaAberta());
  }, []);

  const total = precoDoIngresso(formato);
  const economia = economiaDaDupla();

  /**
   * O código do PIX já sai com o valor dentro, para ninguém digitar errado.
   * Sem identificador: o protocolo só existe depois do envio, e uma cobrança
   * de R$ 15 não precisa dele para ser reconciliada — o nome e o valor bastam.
   */
  const payloadPix = useMemo(() => {
    if (!pixDisponivel || total <= 0) return '';
    return gerarPixCopiaECola({
      chave: PIX.chave,
      beneficiario: PIX.nomeNoQr,
      cidade: PIX.cidade,
      valor: total,
    });
  }, [pixDisponivel, total]);

  useEffect(() => {
    if (!payloadPix || metodo !== 'pix') {
      setQrCode('');
      return;
    }
    let vivo = true;
    QRCode.toDataURL(payloadPix, {
      width: 480,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#3d1c04ff', light: '#ffffffff' },
    })
      .then((url) => vivo && setQrCode(url))
      .catch(() => vivo && setQrCode(''));
    return () => {
      vivo = false;
    };
  }, [payloadPix, metodo]);

  // Prévia do comprovante, sem vazar o object URL.
  useEffect(() => {
    if (!comprovante || !comprovante.type.startsWith('image/')) {
      setPrevia(null);
      return;
    }
    const url = URL.createObjectURL(comprovante);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [comprovante]);

  const nome1Ok = nome1.trim().length >= 3;
  const nome2Ok = formato === 'individual' || nome2.trim().length >= 3;
  const whatsappOk = telefoneValido(whatsapp1);
  // No PIX o comprovante é obrigatório: sem ele não há o que conferir, e a
  // linha ficaria "A conferir" para sempre.
  const comprovanteOk = metodo !== 'pix' || (Boolean(comprovante) && !erroArquivo);
  const podeEnviar = nome1Ok && nome2Ok && whatsappOk && consentimento && comprovanteOk;

  async function escolherArquivo(bruto: File | null) {
    setErroArquivo('');
    if (!bruto) {
      setComprovante(null);
      return;
    }
    if (!TIPOS_ACEITOS.includes(bruto.type as (typeof TIPOS_ACEITOS)[number])) {
      setComprovante(null);
      setErroArquivo('Manda uma imagem (JPG, PNG) ou um PDF.');
      return;
    }
    const pronto = await prepararArquivo(bruto);
    if (pronto.size > TAMANHO_MAXIMO) {
      setComprovante(null);
      setErroArquivo('O arquivo passou de 3 MB mesmo depois de reduzir. Manda um print menor.');
      return;
    }
    setComprovante(pronto);
  }

  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(payloadPix);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Sem permissão de área de transferência o código continua à vista,
      // selecionável. Não vale interromper a compra por causa disso.
    }
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setTocado({ nome1: true, nome2: true, whatsapp1: true });
    if (!podeEnviar || situacao === 'enviando') return;

    setSituacao('enviando');
    setErro('');

    const dados = new FormData();
    dados.set('formato', formato);
    dados.set('nome1', nome1.trim());
    if (formato === 'dupla') dados.set('nome2', nome2.trim());
    dados.set('whatsapp1', whatsapp1);
    dados.set('consentimento', 'true');
    dados.set('metodo', metodo === 'pix' ? 'pix' : 'checkout');
    if (metodo === 'pix' && comprovante) dados.set('comprovante', comprovante);

    try {
      const resposta = await fetch('/api/baile', { method: 'POST', body: dados });
      const corpo = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        setErro(corpo.erro || 'Não conseguimos registrar seu ingresso. Tente de novo.');
        setSituacao('erro');
        return;
      }

      setProtocolo(corpo.protocolo || '');

      if (corpo.checkoutUrl) {
        // O ingresso já está gravado como "aguardando". Agora o pagamento.
        window.location.href = corpo.checkoutUrl;
        return;
      }

      // No PIX não há para onde mandar: o comprovante já está com a gente e a
      // escola confere. A pessoa fica aqui mesmo, sabendo o que vai acontecer.
      if (metodo === 'pix') {
        setSituacao('recebido');
        return;
      }

      // Checkout que não gerou cobrança. O caminho é um só: tentar de novo.
      //
      // Isso pode deixar uma linha "Aguardando pagamento" a mais na planilha,
      // já que a primeira tentativa gravou. É troca consciente: uma linha
      // órfã num caminho raro custa menos que uma venda perdida, e só uma das
      // duas vira "Pago".
      setErro(
        'A página de pagamento não abriu. Seus dados já estão com a gente — aperte em Pagar de novo.',
      );
      setSituacao('erro');
    } catch {
      setErro('Sua conexão caiu no meio do envio. Confere a internet e tenta de novo.');
      setSituacao('erro');
    }
  }

  // ── Venda fechada ─────────────────────────────────────────────────────────
  if (!BAILE.ativo || !vendaAberta) {
    return (
      <div className="bg-white rounded-[32px] p-8 text-[#682c0b] shadow-2xl shadow-black/20">
        <div className="w-14 h-14 rounded-full bg-brown-100 grid place-items-center mx-auto mb-5">
          <Ticket className="text-brown-700" size={26} aria-hidden />
        </div>
        <h3 className="text-2xl font-display font-bold text-center mb-3">
          A venda antecipada fechou
        </h3>
        <p className="text-brown-700 text-center mb-6">
          A entrada agora é na portaria, por{' '}
          <strong className="text-[#682c0b]">{formatarReais(BAILE.naHora)}</strong> por pessoa, em
          dinheiro ou PIX. Te esperamos lá.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${encodeURIComponent(
            `Oi! Queria saber da entrada do ${BAILE.nome}.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable w-full inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-6 py-4 rounded-2xl font-bold hover:bg-terracotta"
        >
          <MessageCircle size={18} aria-hidden /> Tirar uma dúvida
        </a>
      </div>
    );
  }

  // ── Comprovante recebido, aguardando conferência ──────────────────────────
  //
  // Diferente do checkout, aqui NÃO há confirmação automática: alguém da
  // escola abre o comprovante e confirma. A tela diz isso com todas as
  // letras, porque prometer "ingresso garantido" antes de alguém olhar seria
  // mentira — e no sábado quem sofre é quem está na porta.
  if (situacao === 'recebido') {
    const mensagem = encodeURIComponent(
      `Oi! Mandei o comprovante do ingresso do ${BAILE.nome}${
        protocolo ? `, protocolo ${protocolo}` : ''
      }.`,
    );
    return (
      <div className="bg-white rounded-[32px] p-8 text-[#682c0b] shadow-2xl shadow-black/20 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 grid place-items-center mx-auto mb-5">
          <Check className="text-green-700" size={26} aria-hidden />
        </div>
        <h3 className="text-2xl font-display font-bold mb-3">Comprovante recebido</h3>
        <p className="text-brown-700 mb-6">
          A gente confere e confirma seu ingresso pelo WhatsApp, no número que você deixou. Pode
          levar algumas horas — se o baile for hoje, chama a gente que resolvemos na hora.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagem}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#1da851]"
        >
          <MessageCircle size={18} aria-hidden /> Falar no WhatsApp
        </a>
        {protocolo && (
          <p className="text-xs text-brown-700 mt-6 pt-5 border-t border-brown-100">
            Protocolo <span className="font-bold tabular-nums tracking-wide">{protocolo}</span>
          </p>
        )}
      </div>
    );
  }

  // ── Formulário ────────────────────────────────────────────────────────────
  const enviando = situacao === 'enviando';

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="bg-white rounded-[32px] p-6 md:p-8 text-[#682c0b] shadow-2xl shadow-black/20"
    >
      <h3 className="text-2xl font-display font-bold mb-1">Seu ingresso</h3>
      <p className="text-sm text-brown-700 mb-6">
        {BAILE.periodo} · {BAILE.horario}
      </p>

      {/* Formato */}
      <fieldset className="mb-6">
        <legend className="text-xs font-bold uppercase tracking-widest text-brown-700 mb-3">
          Para quantas pessoas
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { id: 'individual' as Formato, rotulo: 'Para mim', icone: User },
              { id: 'dupla' as Formato, rotulo: 'Para dois', icone: Users },
            ]
          ).map(({ id, rotulo, icone: Icone }) => {
            const ativo = formato === id;
            return (
              // O input é `sr-only`, então o anel de foco do navegador não
              // aparece em lugar nenhum. Sem o `has-[:focus-visible]` abaixo,
              // quem navega por teclado atravessa este grupo às cegas.
              <label
                key={id}
                className={`pressable-lg cursor-pointer rounded-2xl border-2 px-4 py-4 text-center transition-[background-color,border-color] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#682c0b] ${
                  ativo
                    ? 'border-[#682c0b] bg-[#fffbeb]'
                    : 'border-brown-200 bg-white hover:bg-brown-50/60'
                }`}
              >
                <input
                  type="radio"
                  name="formato"
                  value={id}
                  checked={ativo}
                  onChange={() => setFormato(id)}
                  className="sr-only"
                />
                <Icone
                  size={20}
                  aria-hidden
                  className={`mx-auto mb-1.5 ${ativo ? 'text-[#682c0b]' : 'text-brown-400'}`}
                />
                <span className="block font-bold text-sm">{rotulo}</span>
                <span className="block text-xs text-brown-700 tabular-nums mt-0.5">
                  {formatarReais(precoDoIngresso(id))}
                </span>
              </label>
            );
          })}
        </div>
        {economia > 0 && (
          <p className="text-xs text-green-700 font-medium mt-2.5">
            O ingresso para dois sai {formatarReais(economia)} mais barato que dois individuais.
          </p>
        )}
      </fieldset>

      {/* Nomes */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="baile-nome1" className="block text-sm font-bold mb-1.5">
            {formato === 'dupla' ? 'Nome da primeira pessoa' : 'Seu nome completo'}
          </label>
          <input
            id="baile-nome1"
            name="nome1"
            type="text"
            autoComplete="name"
            value={nome1}
            onChange={(e) => setNome1(e.target.value)}
            onBlur={() => setTocado((t) => ({ ...t, nome1: true }))}
            placeholder="Como está no documento"
            className="w-full px-4 py-3 rounded-xl border-2 border-brown-200 bg-white focus:outline-none focus:border-terracotta"
          />
          {tocado.nome1 && !nome1Ok && (
            <p className="text-xs text-red-700 mt-1.5">Escreva o nome completo.</p>
          )}
        </div>

        {formato === 'dupla' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            <label htmlFor="baile-nome2" className="block text-sm font-bold mb-1.5">
              Nome da segunda pessoa
            </label>
            <input
              id="baile-nome2"
              name="nome2"
              type="text"
              value={nome2}
              onChange={(e) => setNome2(e.target.value)}
              onBlur={() => setTocado((t) => ({ ...t, nome2: true }))}
              placeholder="Quem vem com você"
              className="w-full px-4 py-3 rounded-xl border-2 border-brown-200 bg-white focus:outline-none focus:border-terracotta"
            />
            {tocado.nome2 && !nome2Ok && (
              <p className="text-xs text-red-700 mt-1.5">
                Escreva o nome da segunda pessoa — é por ele que a portaria libera a entrada.
              </p>
            )}
          </motion.div>
        )}

        <div>
          <label htmlFor="baile-whatsapp" className="block text-sm font-bold mb-1.5">
            WhatsApp
          </label>
          <input
            id="baile-whatsapp"
            name="whatsapp1"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formatarTelefone(whatsapp1)}
            onChange={(e) => setWhatsapp1(e.target.value)}
            onBlur={() => setTocado((t) => ({ ...t, whatsapp1: true }))}
            placeholder="(67) 99263-0948"
            className="w-full px-4 py-3 rounded-xl border-2 border-brown-200 bg-white focus:outline-none focus:border-terracotta tabular-nums"
          />
          {tocado.whatsapp1 && !whatsappOk && (
            <p className="text-xs text-red-700 mt-1.5">Use DDD + número, como (67) 99263-0948.</p>
          )}
          <p className="text-xs text-brown-700 mt-1.5">
            É por aqui que a gente confirma seu ingresso. Um contato basta para os dois.
          </p>
        </div>

        {/* Não se pede e-mail aqui: o ingresso precisa de nome e número, e é
            isso. Em troca, a InfinitePay abre o passo "Contato" dela pedindo
            e-mail e a confirmação do número — ela só pula esse passo quando a
            cobrança nasce com e-mail, o que foi medido em 19/10/2026, isolando
            um campo de cada vez. A rota continua aceitando `email1` se algum
            dia voltar a vir. */}
      </div>

      {/* ── Como pagar ──────────────────────────────────────────────────────
          Só aparece quando há de fato uma escolha. Com um caminho só, um
          seletor de uma opção é decoração que pede um clique à toa. */}
      {checkoutDisponivel && pixDisponivel && (
        <fieldset className="mb-6">
          <legend className="text-xs font-bold uppercase tracking-widest text-brown-700 mb-3">
            Como você prefere pagar
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  id: 'checkout' as Metodo,
                  rotulo: 'Pelo site',
                  apoio: 'PIX ou cartão',
                  icone: CreditCard,
                },
                {
                  id: 'pix' as Metodo,
                  rotulo: 'PIX direto',
                  apoio: 'Anexando o comprovante',
                  icone: Smartphone,
                },
              ]
            ).map(({ id, rotulo, apoio, icone: Icone }) => {
              const ativo = metodo === id;
              return (
                <label
                  key={id}
                  className={`pressable-lg cursor-pointer rounded-2xl border-2 px-4 py-3.5 text-center transition-[background-color,border-color] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#682c0b] ${
                    ativo
                      ? 'border-[#682c0b] bg-[#fffbeb]'
                      : 'border-brown-200 bg-white hover:bg-brown-50/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="metodo"
                    value={id}
                    checked={ativo}
                    onChange={() => setMetodo(id)}
                    className="sr-only"
                  />
                  <Icone
                    size={19}
                    aria-hidden
                    className={`mx-auto mb-1.5 ${ativo ? 'text-[#682c0b]' : 'text-brown-400'}`}
                  />
                  <span className="block font-bold text-sm">{rotulo}</span>
                  <span className="block text-[11px] text-brown-700 mt-0.5">{apoio}</span>
                </label>
              );
            })}
          </div>

          <p className="text-xs text-brown-700 mt-2.5">
            {metodo === 'checkout'
              ? 'A confirmação é na hora, sem precisar mandar comprovante.'
              : 'A gente confere o comprovante e confirma pelo WhatsApp — não é automático.'}
          </p>
        </fieldset>
      )}

      {/* ── PIX: código, QR e comprovante ──────────────────────────────────── */}
      {metodo === 'pix' && pixDisponivel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          className="mb-6 overflow-hidden"
        >
          <div className="rounded-2xl border-2 border-brown-200 bg-brown-50/60 p-4 space-y-4">
            <div>
              <p className="text-sm font-bold mb-1">
                1. Pague {formatarReais(total)} no PIX
              </p>
              <p className="text-xs text-brown-700 mb-3">
                O código já vai com o valor certo — não precisa digitar nada.
              </p>

              {qrCode && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={qrCode}
                  alt={`QR Code do PIX de ${formatarReais(total)}`}
                  width={160}
                  height={160}
                  className="w-40 h-40 mx-auto mb-3 rounded-xl bg-white p-1.5 border border-brown-200"
                />
              )}

              <button
                type="button"
                onClick={() => void copiarPix()}
                className="pressable w-full inline-flex items-center justify-center gap-2 bg-[#682c0b] text-orange-50 px-4 py-3 rounded-xl font-bold text-sm hover:bg-terracotta"
              >
                {copiado ? (
                  <>
                    <Check size={16} aria-hidden /> Código copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} aria-hidden /> Copiar código PIX
                  </>
                )}
              </button>
              <p aria-live="polite" className="sr-only">
                {copiado ? 'Código PIX copiado.' : ''}
              </p>
              <p className="text-[11px] text-brown-700 mt-2 text-center">
                Em nome de {PIX.beneficiario}
              </p>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <p className="text-sm font-bold mb-1">2. Anexe o comprovante</p>
              <p className="text-xs text-brown-700 mb-3">
                Print ou PDF, até 3 MB. É com ele que a gente confirma seu nome na portaria.
              </p>

              {comprovante ? (
                <div className="flex items-center gap-3 rounded-xl border-2 border-green-300 bg-green-50 p-3">
                  {previa ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previa}
                      alt="Prévia do comprovante anexado"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-green-300"
                    />
                  ) : (
                    <span className="w-12 h-12 rounded-lg bg-white grid place-items-center shrink-0 border border-green-300">
                      <Paperclip size={18} className="text-green-700" aria-hidden />
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold truncate">{comprovante.name}</span>
                    <span className="block text-xs text-brown-700 tabular-nums">
                      {(comprovante.size / 1024).toFixed(0)} KB
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => void escolherArquivo(null)}
                    aria-label="Remover comprovante"
                    className="pressable-sm shrink-0 w-9 h-9 grid place-items-center rounded-lg text-brown-700 hover:bg-white"
                  >
                    <Trash2 size={17} aria-hidden />
                  </button>
                </div>
              ) : (
                <label className="pressable-lg flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brown-300 bg-white px-4 py-6 cursor-pointer hover:bg-brown-50/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#682c0b]">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => void escolherArquivo(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <Paperclip size={20} className="text-brown-700" aria-hidden />
                  <span className="text-sm font-bold">Toque para anexar o comprovante</span>
                  <span className="text-xs text-brown-700">JPG, PNG ou PDF</span>
                </label>
              )}

              {erroArquivo && (
                <p role="alert" className="text-xs text-red-800 mt-2">
                  {erroArquivo}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Consentimento. Mesmo cuidado dos rádios: o input é `sr-only` e sem o
          `has-[:focus-visible]` o foco do teclado some nesta caixa — que é
          obrigatória para comprar. */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer rounded-lg p-1 -m-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#682c0b]">
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
        <span className="text-xs text-brown-700 leading-relaxed">
          Autorizo a Estações a guardar meus dados para confirmar este ingresso e falar comigo
          sobre ele. Veja a{' '}
          <a
            href="/politica-de-privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-orange-700 underline underline-offset-2"
          >
            política de privacidade
          </a>
          .
        </span>
      </label>

      {/* Total */}
      <div className="rounded-2xl bg-[#311707] text-orange-50 px-5 py-4 mb-5">
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-sm">
            {formato === 'dupla' ? 'Ingresso para dois' : 'Ingresso individual'}
          </span>
          <span className="text-2xl font-display font-bold text-[#fbbf24] tabular-nums">
            {formatarReais(total)}
          </span>
        </div>
        <p className="text-xs text-orange-200/90 mt-1.5">
          Na portaria sai {formatarReais(BAILE.naHora)} por pessoa.
        </p>
      </div>

      {/* A compra tem um caminho só: este formulário, indo para a InfinitePay.
          Por isso o erro não oferece atalho por fora — ele nomeia o problema e
          a saída é o próprio botão, logo abaixo. Toda mensagem daqui e da rota
          tem de terminar em algo que a pessoa possa fazer nesta tela. */}
      {erro && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 mb-5">
          <AlertCircle size={17} className="text-red-700 shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-red-900">{erro}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!podeEnviar || enviando}
        className="pressable w-full inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-4 rounded-2xl font-bold tracking-wide hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enviando ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden />{' '}
            {metodo === 'pix' ? 'Enviando comprovante…' : 'Levando para o pagamento…'}
          </>
        ) : situacao === 'erro' ? (
          // Depois de um erro o botão nomeia a saída, não repete a oferta:
          // "Pagar R$ 15" de novo parece o mesmo botão que acabou de falhar.
          <>
            Tentar de novo <Ticket size={18} aria-hidden />
          </>
        ) : metodo === 'pix' ? (
          // No PIX a pessoa JÁ pagou no banco dela. O botão que diz "Pagar"
          // aqui faria parecer que vai cobrar de novo.
          <>
            Enviar comprovante <Ticket size={18} aria-hidden />
          </>
        ) : (
          <>
            Pagar {formatarReais(total)} <Ticket size={18} aria-hidden />
          </>
        )}
      </button>

      <p className="text-xs text-brown-700 text-center mt-3">
        {metodo === 'pix'
          ? 'Seu ingresso vale depois que a gente conferir o comprovante. A confirmação chega no seu WhatsApp.'
          : 'Você paga na página da InfinitePay, no PIX ou no cartão. O cartão tem a taxa da operadora.'}
      </p>
    </form>
  );
}
