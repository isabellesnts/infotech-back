import { Request, Response } from "express";
import Produto from "../model/Produto.js";

class ProdutoController {



    static async todos(req: Request, res: Response): Promise<Response> {

        try {

            const listaProdutos = await Produto.listarProdutos();

            return res.status(200).json(listaProdutos);

        } catch (error) {

            console.error(
                `Erro ao consultar produtos. ${error}`
            );

            return res.status(500).json({
                mensagem: "Não foi possível acessar a lista de produtos."
            });
        }
    }



    static async um(req: Request, res: Response): Promise<Response> {

        try {

            const id_produto = Number(req.params.id);

            const produto = await Produto.listarProduto(id_produto);

            return res.status(200).json(produto);

        } catch (error) {

            console.error(
                `Erro ao consultar produto. ${error}`
            );

            if (
                error instanceof Error &&
                error.message.includes("não encontrado")
            ) {

                return res.status(404).json({
                    mensagem: error.message
                });
            }

            return res.status(500).json({
                mensagem: "Não foi possível consultar o produto."
            });
        }
    }



    static async criar(req: Request, res: Response): Promise<Response> {

        try {

            const dadosRecebidos = req.body;

            const produto = new Produto(
                dadosRecebidos.id_categoria,
                dadosRecebidos.codigo,
                dadosRecebidos.nome,
                dadosRecebidos.descricao,
                dadosRecebidos.preco_unitario,
                dadosRecebidos.quantidade_disponivel,
                dadosRecebidos.quantidade_minima,
                dadosRecebidos.ativo
            );

            await Produto.cadastrarProduto(produto);

            return res.status(201).json({
                mensagem: "Produto cadastrado com sucesso."
            });

        } catch (error) {

            console.error(
                `Erro ao cadastrar produto. ${error}`
            );

            return res.status(500).json({
                mensagem: "Não foi possível cadastrar o produto."
            });
        }
    }



    static async atualizar(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const id_produto = Number(req.params.id);

            const dadosRecebidos = req.body;

            await Produto.atualizarProduto(
                id_produto,
                dadosRecebidos.id_categoria,
                dadosRecebidos.codigo,
                dadosRecebidos.nome,
                dadosRecebidos.descricao,
                dadosRecebidos.preco_unitario,
                dadosRecebidos.quantidade_disponivel,
                dadosRecebidos.quantidade_minima,
                dadosRecebidos.ativo
            );

            return res.status(200).json({
                mensagem: "Produto atualizado com sucesso."
            });

        } catch (error) {

            console.error(
                `Erro ao atualizar produto. ${error}`
            );

            if (
                error instanceof Error &&
                error.message.includes("não encontrado")
            ) {

                return res.status(404).json({
                    mensagem: error.message
                });
            }

            return res.status(500).json({
                mensagem: "Não foi possível atualizar o produto."
            });
        }
    }




    static async deletar(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const id_produto = Number(req.params.id);

            await Produto.removerProduto(id_produto);

            return res.status(200).json({
                mensagem: "Produto removido com sucesso."
            });

        } catch (error) {

            console.error(
                `Erro ao remover produto. ${error}`
            );

            if (
                error instanceof Error &&
                error.message.includes("não encontrado")
            ) {

                return res.status(404).json({
                    mensagem: error.message
                });
            }

            return res.status(500).json({
                mensagem: "Não foi possível remover o produto."
            });
        }
    }
}

export default ProdutoController;