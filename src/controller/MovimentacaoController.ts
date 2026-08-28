import Movimentacao from "../model/Movimentacao.js";
import { type Request, type Response } from "express";
import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";

class MovimentacaoController extends Movimentacao {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeMovimentacoes = await Movimentacao.listarMovimentacoes();

            return res.status(200).json(listaDeMovimentacoes);
        } catch (error) {
            console.log(`Erro ao acessar listagem de movimentações: ${error}`);

            return res.status(400).json("Erro ao acessar listagem de movimentações");
        }
    }

    static async um(req: Request, res: Response): Promise<Response> {
        try {
            const id_movimentacao = parseInt(req.params.id_movimentacao as string);

            const movimentacao = await Movimentacao.listarMovimentacao(id_movimentacao);

            if (movimentacao) {
                return res.status(200).json(movimentacao);
            } else {
                return res.status(404).json("Movimentação não encontrada");
            }
        } catch (error) {
            console.log(`Erro ao buscar movimentação: ${error}`);

            return res.status(400).json("Erro ao buscar movimentação");
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: MovimentacaoDTO = req.body;

            const movimentacao = new Movimentacao(
                dadosRecebidos.produto.id_produto,
                dadosRecebidos.tipo,
                dadosRecebidos.motivo,
                dadosRecebidos.quantidade,
                dadosRecebidos.observacao,
                dadosRecebidos.preco_unitario_praticado,
                dadosRecebidos.valor_total,
                dadosRecebidos.id_movimentacao_origem
            );

            const resultado = await Movimentacao.cadastrarMovimentacao(movimentacao);

            if (resultado) {
                return res.status(200).json("Movimentação cadastrada com sucesso");
            } else {
                return res.status(400).json("Erro ao cadastrar movimentação");
            }
        } catch (error) {
            console.log(`Erro ao cadastrar movimentação: ${error}`);

            return res.status(400).json("Erro ao cadastrar movimentação");
        }
    }

}

export default MovimentacaoController;