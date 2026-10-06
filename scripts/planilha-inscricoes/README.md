# Ligar o formulário de inscrição à planilha do Google

O formulário do site já está pronto. Falta criar o lado do Google: uma planilha,
uma pasta para os comprovantes e um script que recebe as inscrições e grava a
linha. São uns 10 minutos, uma vez só.

Enquanto isso não estiver feito, o formulário **não finge que deu certo**: ele
mostra o aviso "o envio automático está fora do ar" com um botão que manda os
mesmos dados pelo WhatsApp. Nenhuma inscrição se perde.

---

## 1. Crie a planilha

1. Abra <https://sheets.new> e dê um nome, por exemplo
   **Inscrições — Curso Intensivo**.
2. Olhe a URL. Entre `/d/` e `/edit` existe um código comprido — esse é o
   **ID da planilha**. Copie.

   ```
   https://docs.google.com/spreadsheets/d/1AbCdEf...XyZ/edit
                                          └──── isto aqui ────┘
   ```

Não precisa criar colunas: o script cria o cabeçalho sozinho na primeira
inscrição.

## 2. Crie a pasta dos comprovantes

1. No Google Drive, crie uma pasta, por exemplo **Comprovantes — Intensivo**.
2. Entre nela e copie o código do fim da URL — é o **ID da pasta**.

   ```
   https://drive.google.com/drive/folders/1GhIjK...LmN
                                          └─ isto aqui ─┘
   ```

## 3. Invente um token

É uma senha que só o site e o script conhecem, para ninguém mais conseguir
escrever na sua planilha. Invente uma frase longa, por exemplo:

```
estacoes-halloween-2026-planilha-k7m2p9x4
```

Guarde: você vai colar em dois lugares.

## 4. Crie o script

1. Abra <https://script.google.com> e clique em **Novo projeto**.
2. Dê o nome **Inscrições Estações**.
3. Apague o conteúdo do editor e cole todo o arquivo
   [`Codigo.gs`](./Codigo.gs) desta pasta.
4. No topo do arquivo, preencha os três valores do `CONFIG`:

   ```js
   const CONFIG = {
     PLANILHA_ID: 'o ID do passo 1',
     ABA: 'Inscrições',
     PASTA_COMPROVANTES_ID: 'o ID do passo 2',
     TOKEN: 'o token do passo 3',
   };
   ```

5. Salve (Ctrl+S).

### Teste antes de publicar

No seletor de funções (em cima, ao lado do ▷), escolha **testarConfiguracao** e
clique em ▷. Na primeira vez o Google pede autorização:

- **Revisar permissões** → escolha sua conta;
- aparece "O Google não verificou este app" → **Avançado** →
  **Acessar Inscrições Estações (não seguro)**;
- **Permitir**.

Isso é normal: o app é seu, feito por você, e o aviso só existe porque ele não
passou pela revisão pública do Google. Ele só acessa a planilha e a pasta que
você indicou.

Se der certo, aparece uma linha de teste na planilha. Confira e apague a linha.
Se der erro, a mensagem diz qual ID está errado.

## 5. Publique como aplicativo da web

1. Canto superior direito: **Implantar** → **Nova implantação**.
2. No ícone de engrenagem ao lado de "Selecionar tipo", escolha
   **App da Web**.
3. Preencha:
   - **Descrição**: `inscrições do site`
   - **Executar como**: **Eu** (seu e-mail)
   - **Quem pode acessar**: **Qualquer pessoa**
4. **Implantar** e copie a **URL do app da Web**. Ela termina em `/exec`.

> **"Qualquer pessoa" é seguro aqui?** É. Quem chamar a URL sem o token recebe
> `token inválido` e nada é gravado. O site guarda o token no servidor, fora do
> código que o visitante baixa.

## 6. Configure as variáveis no site

### Para testar na sua máquina

Crie o arquivo `.env.local` na raiz do projeto (ele não vai para o Git):

```
INSCRICOES_WEBHOOK_URL=https://script.google.com/macros/s/AKfy.../exec
INSCRICOES_TOKEN=estacoes-halloween-2026-planilha-k7m2p9x4
```

Reinicie o `npm run dev` depois de criar o arquivo.

### Para o site no ar

Na Vercel: **Settings → Environment Variables**, adicione as duas com os mesmos
valores, marcando **Production**.

> Variável só vale para deploys criados **depois** de salvar. Depois de
> adicionar, vá em **Deployments**, abra o mais recente e use
> **Redeploy** — senão o site continua sem enxergar a variável.
>
> O nome diferencia maiúscula de minúscula: tem que ser `INSCRICOES_TOKEN`,
> não `Inscricoes_Token`.

## 7. Faça uma inscrição de teste

Entre em `/cursos-intensivos`, preencha o formulário e envie com qualquer
imagem como comprovante. Confira:

- a linha apareceu na planilha, com o protocolo;
- a coluna **Comprovante** tem um link que abre o arquivo no Drive;
- o telefone saiu formatado, tipo `(67) 99263-0948`.

Depois apague a linha de teste e o arquivo.

---

## Depois, no dia a dia

A coluna **Status** nasce como `A conferir`. Troque para `Pago` ou `Cancelado`
conforme for confirmando — o script nunca sobrescreve linha existente, só
acrescenta no fim.

Para receber um aviso a cada inscrição nova: na planilha,
**Ferramentas → Regras de notificação → Notificar quando qualquer alteração for
feita → Imediatamente**.

## Quando alguma coisa der errado

| O que aparece | Causa provável |
|---|---|
| "O envio automático está fora do ar" | As variáveis não estão definidas, ou o deploy não foi refeito depois de salvá-las. |
| "Não conseguimos registrar sua inscrição agora" | O script respondeu erro. Veja **Execuções** no editor do Apps Script: a mensagem está lá. |
| `token inválido` nas execuções | O `TOKEN` do script e o `INSCRICOES_TOKEN` da Vercel estão diferentes. |
| A linha grava, mas sem comprovante | O `PASTA_COMPROVANTES_ID` está errado ou a pasta foi apagada. |

Se você editar o `Codigo.gs` depois de publicar, precisa **Implantar → Gerenciar
implantações → ✏️ → Versão: Nova versão → Implantar**. Sem isso o Google
continua rodando a versão antiga. A URL não muda.
