import { Request, Response } from "express";
import { categoriaModel } from "../models/categoriaModel";

async function listar(_req: Request, res: Response) {
  const categorias = await categoriaModel.findAll();
  res.json(categorias);
}

async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  const categoria = await categoriaModel.findById(id);

  if (!categoria) {
    return res.status(404).json({ erro: "Categoria não encontrada." });
  }
  res.json(categoria);
}

async function criar(req: Request, res: Response) {
  const { nome } = req.body;

  const existente = await categoriaModel.findByNome(nome);
  if (existente) {
    return res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
  }

  const categoria = await categoriaModel.create({ nome });
  res.status(201).json(categoria);
}

async function atualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome } = req.body;

  const categoriaAtual = await categoriaModel.findById(id);
  if (!categoriaAtual) {
    return res.status(404).json({ erro: "Categoria não encontrada." });
  }

  const existente = await categoriaModel.findByNome(nome);
  if (existente && existente.id_categoria !== id) {
    return res.status(409).json({ erro: "Já existe uma categoria com esse nome." });
  }

  const categoria = await categoriaModel.update(id, { nome });
  res.json(categoria);
}

async function remover(req: Request, res: Response) {
  const id = Number(req.params.id);

  const categoria = await categoriaModel.findById(id);
  if (!categoria) {
    return res.status(404).json({ erro: "Categoria não encontrada." });
  }

  try {
    await categoriaModel.remove(id);
    res.status(204).send();
  } catch (error: any) {
    // violação de FK: existem produtos vinculados a essa categoria
    if (error.code === "23503") {
      return res.status(409).json({
        erro: "Não é possível excluir: existem produtos vinculados a essa categoria.",
      });
    }
    res.status(500).json({ erro: "Erro ao excluir categoria." });
  }
}

// Rota específica: GET /categorias/:id/produtos
async function listarProdutos(req: Request, res: Response) {
  const id = Number(req.params.id);

  const categoria = await categoriaModel.findById(id);
  if (!categoria) {
    return res.status(404).json({ erro: "Categoria não encontrada." });
  }

  const produtos = await categoriaModel.findProdutosByCategoria(id);
  res.json(produtos);
}

export const categoriaController = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
  listarProdutos,
};
