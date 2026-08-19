import { pool } from "../config/database";

export interface Categoria {
  id_categoria: number;
  nome: string;
}

export interface CategoriaInput {
  nome: string;
}

async function findAll(): Promise<Categoria[]> {
  const result = await pool.query<Categoria>(
    "SELECT id_categoria, nome FROM categoria ORDER BY nome"
  );
  return result.rows;
}

async function findById(id: number): Promise<Categoria | null> {
  const result = await pool.query<Categoria>(
    "SELECT id_categoria, nome FROM categoria WHERE id_categoria = $1",
    [id]
  );
  return result.rows[0] ?? null;
}

async function findByNome(nome: string): Promise<Categoria | null> {
  const result = await pool.query<Categoria>(
    "SELECT id_categoria, nome FROM categoria WHERE LOWER(nome) = LOWER($1)",
    [nome]
  );
  return result.rows[0] ?? null;
}

async function create(data: CategoriaInput): Promise<Categoria> {
  const result = await pool.query<Categoria>(
    "INSERT INTO categoria (nome) VALUES ($1) RETURNING id_categoria, nome",
    [data.nome]
  );
  return result.rows[0];
}

async function update(id: number, data: CategoriaInput): Promise<Categoria | null> {
  const result = await pool.query<Categoria>(
    "UPDATE categoria SET nome = $1 WHERE id_categoria = $2 RETURNING id_categoria, nome",
    [data.nome, id]
  );
  return result.rows[0] ?? null;
}

async function remove(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM categoria WHERE id_categoria = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// Rota especifica: lista os produtos vinculados a uma categoria
// (relacionamento 1:N categoria -> produto do DER).
async function findProdutosByCategoria(id: number) {
  const result = await pool.query(
    `SELECT id_produto, codigo, nome, preco_unitario, quantidade_disponivel, ativo
       FROM produto
      WHERE id_categoria = $1
      ORDER BY nome`,
    [id]
  );
  return result.rows;
}

export const categoriaModel = {
  findAll,
  findById,
  findByNome,
  create,
  update,
  remove,
  findProdutosByCategoria,
};
