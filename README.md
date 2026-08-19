# estoque-api

API backend do Sistema de Controle de Estoque (InfoTech Informática) — Entrega 2 (Model & Controller).

## Stack
Node.js + Express + TypeScript + PostgreSQL (driver `pg`, sem ORM).

## Estrutura
```
src/
  config/       conexão com o banco (pool pg)
  models/       acesso a dados (SQL)
  controllers/  regras de cada rota
  middlewares/  validação de entrada
  routes/       definição das rotas
  app.ts        configuração do Express
  server.ts     ponto de entrada
sql/
  schema.sql    script de criação do banco (tabelas + triggers)
```

## Como rodar

1. Suba um PostgreSQL e configure o `.env` (veja `.env.example`).
2. Rode o script `sql/schema.sql` no banco.
3. `npm install`
4. `npm run dev` (desenvolvimento) ou `npm run build && npm start` (produção).

## Entidade implementada: Categoria

CRUD completo em `/api/categorias`:

| Método | Rota                       | Descrição                                   |
|--------|-----------------------------|----------------------------------------------|
| GET    | /api/categorias             | Lista todas as categorias                     |
| GET    | /api/categorias/:id         | Busca uma categoria pelo id                   |
| GET    | /api/categorias/:id/produtos| Rota específica: lista os produtos da categoria (relação 1:N do DER) |
| POST   | /api/categorias             | Cria uma categoria                            |
| PUT    | /api/categorias/:id         | Atualiza uma categoria                        |
| DELETE | /api/categorias/:id         | Remove uma categoria (bloqueada se houver produtos vinculados) |

### Validações implementadas
- `nome` obrigatório, string, entre 2 e 80 caracteres.
- Nome duplicado retorna `409`.
- `:id` precisa ser inteiro positivo, senão `400`.
- Exclusão bloqueada com `409` se existirem produtos vinculados à categoria (violação de FK).

### Testes manuais realizados (via curl, rodando localmente)
Todas as rotas foram testadas de ponta a ponta contra um PostgreSQL local com o schema aplicado:
- `GET /api/health` → 200
- `GET /api/categorias` (lista vazia) → 200 `[]`
- `POST /api/categorias` válido → 201, registro criado
- `POST /api/categorias` sem nome → 400
- `POST /api/categorias` nome com 1 caractere → 400
- `POST /api/categorias` nome duplicado → 409
- `GET /api/categorias/:id` existente → 200
- `GET /api/categorias/:id` inexistente → 404
- `GET /api/categorias/:id` id inválido (`abc`) → 400
- `PUT /api/categorias/:id` → 200, nome atualizado
- `GET /api/categorias/:id/produtos` → 200 `[]`
- `DELETE /api/categorias/:id` → 204, e listagem confirma remoção

## Próximos passos
Entidades **Produto** e **Movimentação** ficam para a próxima entrega, seguindo o mesmo padrão (model → validação → controller → rotas).
