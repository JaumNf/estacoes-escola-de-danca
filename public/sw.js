/* Service worker da Estações.
 *
 * Trocado em 19/10/2026, por dois defeitos que só apareceriam no pior
 * momento — logo depois de um deploy:
 *
 * 1. A versão anterior usava stale-while-revalidate INCLUSIVE para navegação
 *    de página. Ela devolvia o HTML do cache e só buscava o novo para a
 *    visita seguinte, então todo visitante que já tivesse estado no site via
 *    a versão antiga depois de publicar — e o HTML antigo aponta para chunks
 *    de JavaScript com hash antigo, que é o caminho curto para um 404 de
 *    chunk e uma página sem comportamento.
 *
 * 2. O precache listava '/favicon.ico' e '/icon.png', que não existem no
 *    repositório. `cache.addAll` é atômico: um 404 rejeita a chamada inteira,
 *    então nada nunca foi pré-cacheado. O .catch apenas escondia isso.
 *
 * Agora: HTML sempre pela rede (cache só quando offline), estático com hash
 * pelo cache (é imutável por construção), imagens revalidando em segundo
 * plano. O nome do cache carrega a data para que uma troca de estratégia
 * invalide o que ficou para trás.
 */
const CACHE_NAME = 'estacoes-2026-10-19';

const ehEstaticoComHash = (url) => url.pathname.startsWith('/_next/static/');
const ehImagem = (url) =>
  url.pathname.startsWith('/images/') ||
  url.pathname.startsWith('/_next/image') ||
  /\.(?:webp|jpg|jpeg|png|svg|avif)$/.test(url.pathname);

self.addEventListener('install', () => {
  // Sem precache: a lista anterior falhava inteira e a home é a primeira
  // coisa que a rede entrega de qualquer jeito.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nomes) =>
        Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // ── Navegação: rede primeiro ────────────────────────────────────────────
  // O que estiver no ar é o que a pessoa vê. O cache existe só para o caso
  // de não haver rede.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((resposta) => {
          if (resposta && resposta.status === 200) {
            const copia = resposta.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copia));
          }
          return resposta;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/'))),
    );
    return;
  }

  // ── Estático com hash: cache primeiro ───────────────────────────────────
  // O nome do arquivo muda quando o conteúdo muda, então servir do cache
  // nunca entrega versão errada.
  if (ehEstaticoComHash(url)) {
    event.respondWith(
      caches.match(req).then(
        (cacheado) =>
          cacheado ||
          fetch(req).then((resposta) => {
            if (resposta && resposta.status === 200) {
              const copia = resposta.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, copia));
            }
            return resposta;
          }),
      ),
    );
    return;
  }

  // ── Imagens: serve o que tem, atualiza por baixo ────────────────────────
  if (ehImagem(url)) {
    event.respondWith(
      caches.match(req).then((cacheado) => {
        const rede = fetch(req)
          .then((resposta) => {
            if (resposta && resposta.status === 200) {
              const copia = resposta.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, copia));
            }
            return resposta;
          })
          .catch(() => cacheado);
        return cacheado || rede;
      }),
    );
  }

  // Todo o resto — rotas de API inclusive — passa direto para a rede.
});
