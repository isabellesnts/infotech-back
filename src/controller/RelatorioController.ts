import type { Request, Response } from "express";
import Relatorio from "../model/Relatorio.js";

class RelatorioController extends Relatorio {
    static async reposicao(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeProdutos = await Relatorio.produtosReposicao();
            return res.status(200).json(listaDeProdutos);
        } catch (error) {
            console.log(`Erro ao acessar relatório de reposição: ${error}`);
            return res.status(400).json("Erro ao acessar relatório de reposição");
        }
    }

    static async valorProduto(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeProdutos = await Relatorio.valorPorProduto();
            return res.status(200).json(listaDeProdutos);
        } catch (error) {
            console.log(`Erro ao acessar relatório de valor por produto: ${error}`);
            return res.status(400).json("Erro ao acessar relatório de valor por produto");
        }
    }

    static async valorTotal(req: Request, res: Response): Promise<Response> {
        try {
            const total = await Relatorio.valorTotalEstoque();
            return res.status(200).json(total);
        } catch (error) {
            console.log(`Erro ao acessar relatório de valor total: ${error}`);
            return res.status(400).json("Erro ao acessar relatório de valor total");
        }
    }
}

export default RelatorioController;