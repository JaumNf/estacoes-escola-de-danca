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
  (`InscricaoForm.tsx`, `Countdown.tsx`, `AulaExperimentalModal.tsx`).
- `components/` — compartilhados: Header, Footer, Chatbot, FAQ, Feedback, mapa, banner de
  cookies, menu de acessibilidade.
- **Duas rotas de API**, ambas só de servidor: `app/api/chat` (Gemini) e
  `app/api/inscricao` (inscrições do intensivo). Os outros formulários ainda enviam para
  `formsubmit.co` e WhatsApp (`wa.me`).
- Imagens ficam em `public/images/` como WebP e passam pelo otimizador do Next. Não há
  `remotePatterns`: imagem nova entra no repositório, não por hotlink.
- `public/` tem `manifest.json`, `sw.js`, `og.jpg` e `images/`.

## A edição do Curso Intensivo mora num arquivo só

`lib/intensivo.ts` é a fonte de verdade: nome e datas da edição, aulas com horário, nível
e preço, faixas de desconto, chave PIX e link do cartão. A página, o formulário e a rota
da API leem daqui — **não escreva data nem preço direto em componente.**

- `EDICAO.ativa` é o interruptor geral. Com `false`, a página mostra "novas edições em
  breve" (`components/EdicaoEmBreve.tsx`) e o formulário nem é montado.
- Linhas marcadas `// CONFIRMAR` são valores que ainda precisam ser conferidos com a
  escola antes de publicar.
- Item com `intervalo: true` aparece no cronograma mas não é vendido; com `evento: true`
  (o baile) é vendido, mas não conta para a faixa de desconto.
- O preço é recalculado no servidor em `app/api/inscricao/route.ts`: o total que o
  navegador manda é ignorado de propósito.

**Inscrições → Google Sheets:** o formulário faz `POST /api/inscricao` (multipart, com o
comprovante). A rota valida, recalcula o preço, gera o protocolo e repassa em JSON para um
Google Apps Script, que grava a linha e salva o comprovante no Drive. O script e o passo a
passo de instalação estão em `scripts/planilha-inscricoes/`. Sem as variáveis de ambiente,
a rota responde 503 e o formulário oferece o caminho do WhatsApp — nunca finge sucesso.

## Variáveis de ambiente

Modelo comentado em `.env.example`.

| Variável | Uso |
|---|---|
| `GEMINI_API_KEY` | `app/api/chat/route.ts` — só servidor. Sem ela a rota responde 503 e o chat mostra aviso. |
| `INSCRICOES_WEBHOOK_URL` | `app/api/inscricao/route.ts` — URL `/exec` do Apps Script. |
| `INSCRICOES_TOKEN` | Segredo compartilhado com o Apps Script; tem que ser idêntico ao `CONFIG.TOKEN` de `Codigo.gs`. |
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
- A imagem de Open Graph já existe (`public/og.jpg`); o `TODO` do AI Studio saiu.

## Git

Não há identidade global nesta máquina. Commite com:
`git -c user.name="JaumNf" -c user.email="gustavoissao2005@gmail.com" commit …`
