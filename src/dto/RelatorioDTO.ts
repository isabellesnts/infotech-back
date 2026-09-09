export interface ProdutoReposicaoDTO {
    id_produto: number;
    codigo: string;
    nome: string;
    quantidade_disponivel: number;
    quantidade_minima: number;
}

export interface ValorProdutoEstoqueDTO {
    id_produto: number;
    codigo: string;
    nome: string;
    quantidade_disponivel: number;
    preco_unitario: number;
    valor_em_estoque: number;
}

export interface ValorTotalEstoqueDTO {
    valor_total_estoque: number;
}