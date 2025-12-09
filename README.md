# Santos Urban Store

Este projeto é uma Single Page Application (SPA) React adaptada para alto desempenho visual, simulando a estética urbana solicitada.

## 1. Instruções de Instalação

Como este ambiente é uma prévia React, as dependências são gerenciadas automaticamente. Se for rodar localmente:

```bash
npm install react react-dom lucide-react papaparse framer-motion clsx tailwind-merge
npm install -D typescript @types/react @types/node @types/papaparse autoprefixer postcss tailwindcss
```

## 2. Estrutura da Planilha (Google Sheets)

Para que o site funcione corretamente com sua planilha, preencha a primeira linha com estes nomes exatos (tudo minúsculo):

| id | nome | marca | preco | imagem | categoria |
| --- | --- | --- | --- | --- | --- |
| 1 | Camiseta Oversized | Nike | 129.90 | https://... | Wear |
| 2 | Shape 8.0 | Santa Cruz | 350.00 | https://... | Shape |

**Categorias Automáticas:** O site cria automaticamente o menu com base no que você digitar na coluna `categoria`.
Exemplo: Se você adicionar um produto com categoria "Bonés", um botão "Bonés" aparecerá automaticamente no site.

**Como conectar:**
Já configurei o código para ler o link que você enviou. Apenas certifique-se de que a planilha está visível para **"Qualquer pessoa com o link"** no botão Compartilhar.

## Observação sobre Next.js
Este código foi gerado como uma aplicação React (Vite/CRA compatible) para garantir a visualização imediata neste ambiente. Para migrar para Next.js, basta mover o conteúdo de `App.tsx` para `app/page.tsx`.