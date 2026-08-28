import type { Request, Response } from "express";
import Movimentacao from "../model/Movimentacao.js";

class MovimentacaoController {

    static async listarMovimentacoes(req: Request, res: Response): Promise<Response> {

        try {

            const movimentacoes = await Movimentacao.listarMovimentacoes();

            if (movimentacoes === null) {
                return res.status(500).json({
                    mensagem: "Erro ao listar movimentações."
                });
            }

            return res.status(200).json(movimentacoes);

        } catch (error) {

            return res.status(500).json({
                mensagem: "Erro interno do servidor.",
                erro: error
            });
        }
    }

    static async listarMovimentacao(req: Request, res: Response): Promise<Response> {

        try {

            const id_movimentacao = Number(req.params.id_movimentacao);

            if (isNaN(id_movimentacao)) {
                return res.status(400).json({
                    mensagem: "ID da movimentação inválido."
                });
            }

            const movimentacao = await Movimentacao.listarMovimentacao(
                id_movimentacao
            );

            if (movimentacao === null) {
                return res.status(404).json({
                    mensagem: "Movimentação não encontrada."
                });
            }

            return res.status(200).json(movimentacao);

        } catch (error) {

            return res.status(500).json({
                mensagem: "Erro interno do servidor.",
                erro: error
            });
        }
    }

    static async cadastrarMovimentacao(req: Request, res: Response): Promise<Response> {

        try {

            const {
                id_produto,
                tipo,
                motivo,
                quantidade,
                preco_unitario_praticado,
                valor_total,
                observacao,
                id_movimentacao_origem
            } = req.body;

            if (
                id_produto === undefined ||
                !tipo ||
                !motivo ||
                quantidade === undefined ||
                !observacao
            ) {
                return res.status(400).json({
                    mensagem: "Preencha todos os campos obrigatórios."
                });
            }

            const movimentacao = new Movimentacao(
                Number(id_produto),
                tipo,
                motivo,
                Number(quantidade),
                observacao,
                preco_unitario_praticado !== undefined
                    ? Number(preco_unitario_praticado)
                    : undefined,
                valor_total !== undefined
                    ? Number(valor_total)
                    : undefined,
                id_movimentacao_origem !== undefined
                    ? Number(id_movimentacao_origem)
                    : undefined
            );

            const resultado = await Movimentacao.cadastrarMovimentacao(
                movimentacao
            );

            if (!resultado) {
                return res.status(400).json({
                    mensagem: "Não foi possível cadastrar a movimentação."
                });
            }

            return res.status(201).json({
                mensagem: "Movimentação cadastrada com sucesso."
            });

        } catch (error) {

            return res.status(500).json({
                mensagem: "Erro interno do servidor.",
                erro: error
            });
        }
    }
}

export default MovimentacaoController;