# CLAUDE.md

Site da **Estações Escola de Dança** (Campo Grande – MS). Criado no Google AI Studio e
trazido para o Claude Code em 12/09/2026.

## Deploy — leia antes de fazer push

- Repo público `JaumNf/estacoes-escola-de-danca`, branch `main`.
- **Push em `main` = deploy de produção na Vercel** (integração GitHub → Vercel).
  No ar em https://escoladedancaestacoes.vercel.app. Nunca faça push sem o usuário pedir.
- O domínio `www.escoladancaestacoes.com.br` aparece em `robots.ts`/`sitemap.ts`, mas não
  resolve — o `layout.tsx` usa a URL da Vercel. As duas estão inconsistentes.
- O GitHub é a versão mais recente. As pastas `~/Downloads/curso-de-verão---dança (N)/`
  são exports antigos (fev/2026) de **outro** app do AI Studio — não são este projeto.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000 (entrada "estacoes" no ~/.claude/launch.json)
npm run build    # typecheck roda no build (ignoreBuildErrors: false); eslint é ignorado
npm run lint
```

Não há testes.

## Stack

Next.js 15 (App Router, `output: 'standalone'`) · React 19 · Tailwind 4 (via
`@tailwindcss/postcss`, config em `app/globals.css`) · `motion` · Embla Carousel ·
React Leaflet · `@google/genai`.

- `app/` — uma pasta por rota: `aulas-regulares`, `cursos-intensivos`, `baile`, `contato`,
  `politica-de-privacidade`. Componentes específicos de rota ficam junto dela
  (`BookingFlow.tsx`, `Countdown.tsx`, `AulaExperimentalModal.tsx`).
- `components/` — compartilhados: Header, Footer, Chatbot, FAQ, Feedback, mapa, banner de
  cookies, menu de acessibilidade.
- **Não há backend nem rotas de API.** Formulários enviam para `formsubmit.co` e WhatsApp
  (`wa.me`); pagamento é PIX manual.
- Imagens são remotas (sobretudo `lh3.googleusercontent.com`); só os hosts listados em
  `next.config.ts > images.remotePatterns` funcionam com `next/image`.
- `public/` tem só `manifest.json` e `sw.js`.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `GEMINI_API_KEY` | `app/api/chat/route.ts` — só servidor. Sem ela a rota responde 503 e o chat mostra aviso. |
| `NEXT_PUBLIC_BASE_URL` | `robots.ts`, `sitemap.ts` (opcional) |

**Chatbot:** `components/Chatbot.tsx` (cliente) faz `POST /api/chat` com `{ history, message }`.
A rota valida (máx. 500 caracteres, últimas 5 mensagens), monta o prompt e chama o Gemini.
O prompt do "Gustavo Bot" fica em `lib/chatbot-prompt.ts` — **nunca importe esse arquivo nem
`@google/genai` em componente `'use client'`, e nunca use `NEXT_PUBLIC_` para chaves.**
Até 12/09/2026 a chave era `NEXT_PUBLIC_GEMINI_API_KEY` e vazou no bundle de produção.

## Resquícios do AI Studio

- `fix_baile.js`, `fix_upload.js`, `remove_rest.js`, `update_*_colors.js` na raiz são
  scripts de edição pontual que o agente do AI Studio usou; não fazem parte do app.
- `metadata.json` e o bloco `DISABLE_HMR` do webpack em `next.config.ts` só servem ao
  AI Studio.
- `layout.tsx` tem `TODO: SUBSTITUIR PELO LINK DA SUA IMAGEM` na imagem de Open Graph.

## Git

Não há identidade global nesta máquina. Commite com:
`git -c user.name="JaumNf" -c user.email="gustavoissao2005@gmail.com" commit …`
