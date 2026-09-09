import type { ProdutoReposicaoDTO, ValorProdutoEstoqueDTO, ValorTotalEstoqueDTO } from "../dto/RelatorioDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Relatorio {
    static async produtosReposicao(): Promise<Array<ProdutoReposicaoDTO> | null> {
        let listaDeProdutos: Array<ProdutoReposicaoDTO> = [];

        try {
            const querySelectReposicao = `SELECT * FROM vw_produtos_reposicao ORDER BY nome;`;
            const respostaBD = await database.query(querySelectReposicao);

            respostaBD.rows.forEach((produto) => {
                const produtoDTO: ProdutoReposicaoDTO = {
                    id_produto: produto.id_produto,
                    codigo: produto.codigo,
                    nome: produto.nome,
                    quantidade_disponivel: produto.quantidade_disponivel,
                    quantidade_minima: produto.quantidade_minima
                };
                listaDeProdutos.push(produtoDTO);
            });

            return listaDeProdutos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async valorPorProduto(): Promise<Array<ValorProdutoEstoqueDTO> | null> {
        let listaDeProdutos: Array<ValorProdutoEstoqueDTO> = [];

        try {
            const querySelectValor = `SELECT * FROM vw_valor_produto_estoque ORDER BY nome;`;
            const respostaBD = await database.query(querySelectValor);

            respostaBD.rows.forEach((produto) => {
                const produtoDTO: ValorProdutoEstoqueDTO = {
                    id_produto: produto.id_produto,
                    codigo: produto.codigo,
                    nome: produto.nome,
                    quantidade_disponivel: produto.quantidade_disponivel,
                    preco_unitario: produto.preco_unitario,
                    valor_em_estoque: produto.valor_em_estoque
                };
                listaDeProdutos.push(produtoDTO);
            });

            return listaDeProdutos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async valorTotalEstoque(): Promise<ValorTotalEstoqueDTO | null> {
        try {
            const querySelectTotal = `SELECT * FROM vw_valor_total_estoque;`;
            const respostaBD = await database.query(querySelectTotal);

            const totalDTO: ValorTotalEstoqueDTO = {
                valor_total_estoque: respostaBD.rows[0].valor_total_estoque
            };

            return totalDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta. ${error}`);
            return null;
        }
    }
}

export default Relatorio;