import type { Request, Response } from "express";
import Produto from "../model/Produto.js";

class ProdutoController extends Produto {
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeProdutos = await Produto.listarProdutos();
            return res.status(200).json(listaDeProdutos);
        } catch (error) {
            console.log(`Erro ao acessar listagem de produtos: ${error}`);
            return res.status(400).json("Erro ao acessar listagem de produtos");
        }
    }

    static async um(req: Request, res: Response): Promise<Response> {
        try {
            const id_produto = parseInt(req.params.id_produto as string);
            const produto = await Produto.listarProduto(id_produto);

            if (produto) {
                return res.status(200).json(produto);
            } else {
                return res.status(404).json("Produto não encontrado");
            }
        } catch (error) {
            console.log(`Erro ao buscar produto: ${error}`);
            return res.status(400).json("Erro ao buscar produto");
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dados = req.body;
            const erros: string[] = [];

            if (!dados.id_categoria || !Number.isInteger(Number(dados.id_categoria))) {
                erros.push("id_categoria é obrigatório e deve ser um número inteiro");
            }
            if (!dados.codigo || String(dados.codigo).trim() === "") {
                erros.push("codigo é obrigatório");
            }
            if (!dados.nome || String(dados.nome).trim() === "") {
                erros.push("nome é obrigatório");
            }
            if (dados.preco_unitario === undefined || Number(dados.preco_unitario) < 0) {
                erros.push("preco_unitario é obrigatório e não pode ser negativo");
            }
            if (dados.quantidade_disponivel !== undefined && Number(dados.quantidade_disponivel) < 0) {
                erros.push("quantidade_disponivel não pode ser negativa");
            }
            if (dados.quantidade_minima !== undefined && Number(dados.quantidade_minima) < 0) {
                erros.push("quantidade_minima não pode ser negativa");
            }

            if (erros.length > 0) {
                return res.status(400).json(erros);
            }

            const novoProduto = new Produto(
                dados.id_categoria,
                dados.codigo,
                dados.nome,
                dados.descricao ?? "",
                dados.preco_unitario,
                dados.quantidade_disponivel ?? 0,
                dados.quantidade_minima ?? 0
            );

            const resultado = await Produto.cadastrarProduto(novoProduto);

            if (resultado) {
                return res.status(200).json("Produto cadastrado com sucesso");
            } else {
                return res.status(400).json("Erro ao cadastrar produto");
            }
        } catch (error) {
            console.log(`Erro ao cadastrar produto: ${error}`);
            return res.status(400).json("Erro ao cadastrar produto");
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const id_produto = parseInt(req.params.id_produto as string);
            const resultado = await Produto.removerProduto(id_produto);

            if (resultado) {
                return res.status(200).json("Produto removido com sucesso");
            } else {
                return res.status(400).json("Erro ao remover produto");
            }
        } catch (error) {
            console.log(`Erro ao remover produto: ${error}`);
            return res.status(400).json("Erro ao remover produto");
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dados = req.body;
            const erros: string[] = [];

            if (!dados.id_categoria || !Number.isInteger(Number(dados.id_categoria))) {
                erros.push("id_categoria é obrigatório e deve ser um número inteiro");
            }
            if (!dados.codigo || String(dados.codigo).trim() === "") {
                erros.push("codigo é obrigatório");
            }
            if (!dados.nome || String(dados.nome).trim() === "") {
                erros.push("nome é obrigatório");
            }
            if (dados.preco_unitario === undefined || Number(dados.preco_unitario) < 0) {
                erros.push("preco_unitario é obrigatório e não pode ser negativo");
            }

            if (erros.length > 0) {
                return res.status(400).json(erros);
            }

            const produtoAtualizado = new Produto(
                dados.id_categoria,
                dados.codigo,
                dados.nome,
                dados.descricao ?? "",
                dados.preco_unitario,
                dados.quantidade_disponivel ?? 0,
                dados.quantidade_minima ?? 0
            );

            produtoAtualizado.setIdProduto(parseInt(req.params.id_produto as string));

            const resultado = await Produto.atualizarProduto(produtoAtualizado);

            if (resultado) {
                return res.status(200).json("Produto atualizado com sucesso");
            } else {
                return res.status(400).json("Erro ao atualizar produto");
            }
        } catch (error) {
            console.log(`Erro ao atualizar produto: ${error}`);
            return res.status(400).json("Erro ao atualizar produto");
        }
    }
}

export default ProdutoController;