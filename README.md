E-commerce Product Page
=======================

Uma página de produto completa desenvolvida com React, TypeScript e Tailwind CSS, simulando a experiência de e-commerces como Amazon, Shopee e Mercado Livre.

Funcionalidades
---------------
- Galeria com imagem principal + miniaturas clicáveis.
- Troca dinâmica de imagens ao selecionar cor, mantendo o índice da imagem.
- Seleção de variante de produto (cor e tamanho).
- Controle de quantidade com estoque limitado.
- Cálculo de frete por CEP usando a API do ViaCEP.
- Feedback por notificações visuais.
- Persistência de estado no localStorage por até 15 minutos.

Lógica de Imagens Dinâmicas
---------------------------
As imagens são carregadas dinamicamente com base na cor e seguem o padrão:

/public/tenis-01-preto.avif  
/public/tenis-01-branco.avif  
/public/tenis-01-azul.avif  
...

Tecnologias
-----------
- Next.js com 'use client'
- TypeScript
- Tailwind CSS
- Axios
- ViaCEP API

Instalação
----------
1. Clone o repositório:
   git clone https://github.com/seu-usuario/nome-do-repo.git

2. Acesse o diretório do projeto:
   cd nome-do-repo

3. Instale as dependências:
   npm install

4. Rode o projeto:
   npm run dev

Estrutura esperada de imagens
-----------------------------
Coloque os arquivos na pasta 'public/' com os nomes conforme o padrão:

/public/
  tenis-01-preto.avif
  tenis-02-preto.avif
  tenis-03-preto.avif
  tenis-04-preto.avif
  tenis-01-branco.avif
  tenis-02-branco.avif
  ...

Licença
-------
Este projeto está sob a licença MIT.

Print screen
-------
![screencapture-localhost-3000-2025-05-22-00_48_17](https://github.com/user-attachments/assets/51988e1f-1e7b-4d0a-acd3-c9a7108e88ef)
