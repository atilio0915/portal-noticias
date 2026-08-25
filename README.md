# Objetivo

Projeto feito para entender melhor cookies e sessão em uma aplicação Node/Express.

## O que o portal faz?

Busca noticias da NewsAPI, permite pesquisar e navegar por categorias. Usuários podem cadastrar, entrar, salvar notícias e remover do perfil.

## Screenshots

![Tela 1](docs/captura-346.png)


## Requisitos

- Node.js 18+
- npm
- Postgres 13+

## Configuração

Crie um banco Postgres e as tabelas usadas pelo backend:

- `cliente` (id, nome, senha)
- `noticiassalvas` (id, user_id, titulo, descricao, url, img)
- `session` (criada automaticamente pelo connect-pg-simple)

## Instalação

1) Instale as dependências (dentro da pasta `projtto`):
2) Configure o Postgres e o `.env` com suas credenciais.
3) Rode o backend e o frontend em terminais separados.
- npm install express-session
- node server\server.js
