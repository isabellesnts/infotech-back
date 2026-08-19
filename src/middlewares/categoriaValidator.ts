import { Request, Response, NextFunction } from "express";

// Validação dos dados de entrada de Categoria, aplicada antes de
// chegar no controller (POST e PUT).
export function validarCategoria(req: Request, res: Response, next: NextFunction) {
  const { nome } = req.body;
  const erros: string[] = [];

  if (nome === undefined || nome === null || String(nome).trim() === "") {
    erros.push("O campo 'nome' é obrigatório.");
  } else {
    if (typeof nome !== "string") {
      erros.push("O campo 'nome' deve ser um texto.");
    } else {
      if (nome.trim().length < 2) {
        erros.push("O campo 'nome' deve ter no mínimo 2 caracteres.");
      }
      if (nome.length > 80) {
        erros.push("O campo 'nome' deve ter no máximo 80 caracteres.");
      }
    }
  }

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  req.body.nome = String(nome).trim();
  next();
}

// Validação do parâmetro :id nas rotas que recebem um identificador.
export function validarIdParam(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erros: ["O parâmetro 'id' deve ser um número inteiro positivo."] });
  }
  next();
}
