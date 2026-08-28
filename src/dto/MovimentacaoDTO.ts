 export default interface MovimentacaoDTO {
    id_movimentacao?: number;
    id_movimentacao_origem?: number;
    tipo: string;
    motivo: string;
    quantidade: number;
    preco_unitario_praticado?: number;
    valor_total?: number;
    observacao: string;
    data_movimentacao?: Date;

    produto: {
        id_produto: number;
        codigo: string;
        nome: string;
    };
}

