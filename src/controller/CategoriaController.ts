import Categoria from "../model/Categoria.js";
import { type Request, type Response } from "express";
import type CategoriaDTO from "../dto/CategoriaDTO.js";

class CategoriaController extends Categoria {

    static async todos(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const listaDeCategorias =
                await Categoria.listarCategorias();

            return res.status(200).json(listaDeCategorias);

        } catch (error) {

            console.log(`Erro ao acessar método herdado: ${error}`);

            return res.status(500).json(
                "Erro ao recuperar as categorias."
            );
        }
    }

    static async categoria(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const idCategoria =
                parseInt(req.params.id as string);

            const categoria =
                await Categoria.listarCategoria(idCategoria);

            if (!categoria) {
                return res.status(404).json({
                    mensagem: "Categoria não encontrada."
                });
            }

            return res.status(200).json(categoria);

        } catch (error) {

            console.log(`Erro ao acessar categoria: ${error}`);

            return res.status(500).json({
                mensagem: "Erro ao recuperar a categoria."
            });
        }
    }

    static async cadastrar(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const dadosRecebidos: CategoriaDTO = req.body;

            const novaCategoria = new Categoria(
                dadosRecebidos.nome
            );

            const result =
                await Categoria.cadastrarCategoria(novaCategoria);

            if (result) {

                return res.status(201).json({
                    mensagem: "Categoria cadastrada com sucesso."
                });

            } else {

                return res.status(500).json({
                    mensagem:
                        "Não foi possível cadastrar a categoria no banco de dados."
                });
            }

        } catch (error) {

            console.log(`Erro ao cadastrar categoria: ${error}`);

            return res.status(500).json({
                mensagem: "Erro ao cadastrar categoria."
            });
        }
    }

    static async atualizar(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const dadosRecebidos: CategoriaDTO = req.body;

            const categoria = new Categoria(
                dadosRecebidos.nome
            );

            categoria.setIdCategoria(
                parseInt(req.params.id as string)
            );

            const result =
                await Categoria.atualizarCategoria(categoria);

            if (result) {

                return res.status(200).json({
                    mensagem: "Categoria atualizada com sucesso."
                });

            } else {

                return res.status(500).json({
                    mensagem:
                        "Não foi possível atualizar a categoria no banco de dados."
                });
            }

        } catch (error) {

            console.log(`Erro ao atualizar categoria: ${error}`);

            return res.status(500).json({
                mensagem: "Erro ao atualizar categoria."
            });
        }
    }

    static async remover(
        req: Request,
        res: Response
    ): Promise<Response> {

        try {

            const idCategoria =
                parseInt(req.params.id as string);

            const result =
                await Categoria.removerCategoria(idCategoria);

            if (result) {

                return res.status(200).json({
                    mensagem: "Categoria removida com sucesso."
                });

            } else {

                return res.status(404).json({
                    mensagem:
                        "Categoria não encontrada ou possui produtos vinculados."
                });
            }

        } catch (error) {

            console.log(`Erro ao remover categoria: ${error}`);

            return res.status(500).json({
                mensagem: "Erro ao remover categoria."
            });
        }
    }
}

export default CategoriaController;