'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  Check,
  Loader2,
  MessageCircle,
  Ticket,
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
  emailValido,
  type Formato,
} from '@/lib/comum';
import { WHATSAPP_ESCOLA } from '@/lib/intensivo';

/**
 * Compra do ingresso do baile.
 *
 * É de propósito mais curto que o formulário do intensivo: aqui não há aulas
 * para escolher, nem lote, nem desconto por quantidade — um ingresso, para uma
 * pessoa ou para duas. Nome, WhatsApp e pronto.
 *
 * O preço mostrado aqui é informativo. **Quem cobra é o servidor**, em
 * `/api/baile`, que recalcula a partir de `lib/baile.ts` e ignora o que este
 * formulário mandar. Não existe campo de total nesta requisição.
 *
 * O pagamento acontece na página da InfinitePay, que oferece PIX e cartão —
 * por isso não há escolha de forma de pagamento aqui.
 */

/** Um passo do formulário, só para dar nome ao estado de envio. */
type Situacao = 'preenchendo' | 'enviando' | 'erro' | 'semCheckout';

export default function IngressoBaileForm() {
  const [formato, setFormato] = useState<Formato>('individual');
  const [nome1, setNome1] = useState('');
  const [nome2, setNome2] = useState('');
  const [whatsapp1, setWhatsapp1] = useState('');
  const [email1, setEmail1] = useState('');
  const [consentimento, setConsentimento] = useState(false);

  const [situacao, setSituacao] = useState<Situacao>('preenchendo');
  const [erro, setErro] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [tocado, setTocado] = useState({ nome1: false, nome2: false, whatsapp1: false });

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

  const nome1Ok = nome1.trim().length >= 3;
  const nome2Ok = formato === 'individual' || nome2.trim().length >= 3;
  const whatsappOk = telefoneValido(whatsapp1);
  // O e-mail é opcional: serve só para a InfinitePay pular uma etapa dela.
  // Se estiver escrito, precisa estar escrito direito.
  const emailOk = email1.trim() === '' || emailValido(email1);
  const podeEnviar = nome1Ok && nome2Ok && whatsappOk && emailOk && consentimento;

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
    if (email1.trim()) dados.set('email1', email1.trim());
    dados.set('consentimento', 'true');

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

      // Gravou, mas a cobrança não pôde ser criada. Em vez de deixar a pessoa
      // sem saída, ela sai daqui com o protocolo e o WhatsApp da escola.
      setSituacao('semCheckout');
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
          <Ticket className="text-brown-500" size={26} aria-hidden />
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

  // ── Gravou, mas sem link de pagamento ─────────────────────────────────────
  if (situacao === 'semCheckout') {
    const mensagem = encodeURIComponent(
      `Oi! Comprei o ingresso do ${BAILE.nome}${
        protocolo ? `, protocolo ${protocolo}` : ''
      }, e quero combinar o pagamento.`,
    );
    return (
      <div className="bg-white rounded-[32px] p-8 text-[#682c0b] shadow-2xl shadow-black/20">
        <div className="w-14 h-14 rounded-full bg-green-100 grid place-items-center mx-auto mb-5">
          <Check className="text-green-700" size={26} aria-hidden />
        </div>
        <h3 className="text-2xl font-display font-bold text-center mb-3">Ingresso reservado</h3>
        <p className="text-brown-700 text-center mb-5">
          Seus dados já estão com a gente. Só o pagamento pelo site não abriu agora — chama no
          WhatsApp que a gente combina o PIX em um minuto.
        </p>
        {protocolo && (
          <div className="flex flex-col items-center gap-1 bg-brown-50 border border-brown-200 rounded-2xl px-6 py-4 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brown-600">
              Protocolo
            </span>
            <span className="text-xl font-display font-bold tabular-nums">{protocolo}</span>
          </div>
        )}
        <a
          href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${mensagem}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#1da851]"
        >
          <MessageCircle size={18} aria-hidden /> Combinar o pagamento
        </a>
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
      <p className="text-sm text-brown-600 mb-6">
        {BAILE.periodo} · {BAILE.horario}
      </p>

      {/* Formato */}
      <fieldset className="mb-6">
        <legend className="text-xs font-bold uppercase tracking-widest text-brown-600 mb-3">
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
              <label
                key={id}
                className={`pressable-lg cursor-pointer rounded-2xl border-2 px-4 py-4 text-center transition-[background-color,border-color] ${
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
                <span className="block text-xs text-brown-600 tabular-nums mt-0.5">
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
          <p className="text-xs text-brown-500 mt-1.5">
            É por aqui que a gente confirma seu ingresso. Um contato basta para os dois.
          </p>
        </div>

        <div>
          <label htmlFor="baile-email" className="block text-sm font-bold mb-1.5">
            E-mail <span className="font-normal text-brown-500">(opcional)</span>
          </label>
          <input
            id="baile-email"
            name="email1"
            type="email"
            autoComplete="email"
            value={email1}
            onChange={(e) => setEmail1(e.target.value)}
            placeholder="voce@email.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-brown-200 bg-white focus:outline-none focus:border-terracotta"
          />
          {!emailOk && (
            <p className="text-xs text-red-700 mt-1.5">
              Confere o e-mail — ou deixe em branco, que também funciona.
            </p>
          )}
          <p className="text-xs text-brown-500 mt-1.5">
            Preenchendo, você adianta uma etapa na página de pagamento.
          </p>
        </div>
      </div>

      {/* Consentimento */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer">
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

      {/* Toda mensagem de erro sai com uma saída junto. Mandar a pessoa falar
          no WhatsApp sem dar o link é o beco sem saída que já custou uma
          inscrição real nesta escola, em 19/10/2026. */}
      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-5"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle size={17} className="text-red-700 shrink-0 mt-0.5" aria-hidden />
            <p className="text-sm text-red-800">{erro}</p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_ESCOLA}?text=${encodeURIComponent(
              `Oi! Tentei comprar o ingresso do ${BAILE.nome} pelo site e não consegui. Meu nome é ${
                nome1.trim() || '...'
              }.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pressable mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#1da851]"
          >
            <MessageCircle size={16} aria-hidden /> Garantir pelo WhatsApp
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={!podeEnviar || enviando}
        className="pressable w-full inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-4 rounded-2xl font-bold tracking-wide hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enviando ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Levando para o pagamento…
          </>
        ) : (
          <>
            Pagar {formatarReais(total)} <Ticket size={18} aria-hidden />
          </>
        )}
      </button>

      <p className="text-xs text-brown-500 text-center mt-3">
        Você paga na página da InfinitePay, no PIX ou no cartão. O cartão tem a taxa da operadora.
      </p>
    </form>
  );
}
