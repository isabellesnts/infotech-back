import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Movimentacao {

    private id_movimentacao: number = 0;
    private id_produto: number;
    private id_movimentacao_origem: number | null = null;
    private tipo: string;
    private motivo: string;
    private quantidade: number;
    private preco_unitario_praticado: number | null = null;
    private valor_total: number | null = null;
    private observacao: string;

    constructor(
        _id_produto: number,
        _tipo: string,
        _motivo: string,
        _quantidade: number,
        _observacao: string,
        _preco_unitario_praticado?: number,
        _valor_total?: number,
        _id_movimentacao_origem?: number
    ) {
        this.id_produto = _id_produto;
        this.tipo = _tipo;
        this.motivo = _motivo;
        this.quantidade = _quantidade;
        this.observacao = _observacao;
        this.preco_unitario_praticado = _preco_unitario_praticado ?? null;
        this.valor_total = _valor_total ?? null;
        this.id_movimentacao_origem = _id_movimentacao_origem ?? null;
    }

    public getIdMovimentacao(): number {
        return this.id_movimentacao;
    }

    public setIdMovimentacao(value: number): void {
        this.id_movimentacao = value;
    }

    public getIdProduto(): number {
        return this.id_produto;
    }

    public setIdProduto(value: number): void {
        this.id_produto = value;
    }

    public getIdMovimentacaoOrigem(): number | null {
        return this.id_movimentacao_origem;
    }

    public setIdMovimentacaoOrigem(value: number | null): void {
        this.id_movimentacao_origem = value;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public setTipo(value: string): void {
        this.tipo = value;
    }

    public getMotivo(): string {
        return this.motivo;
    }

    public setMotivo(value: string): void {
        this.motivo = value;
    }

    public getQuantidade(): number {
        return this.quantidade;
    }

    public setQuantidade(value: number): void {
        this.quantidade = value;
    }

    public getPrecoUnitarioPraticado(): number | null {
        return this.preco_unitario_praticado;
    }

    public setPrecoUnitarioPraticado(value: number | null): void {
        this.preco_unitario_praticado = value;
    }

    public getValorTotal(): number | null {
        return this.valor_total;
    }

    public setValorTotal(value: number | null): void {
        this.valor_total = value;
    }

    public getObservacao(): string {
        return this.observacao;
    }

    public setObservacao(value: string): void {
        this.observacao = value;
    }

    static async listarMovimentacoes(): Promise<Array<MovimentacaoDTO> | null> {

        const listaDeMovimentacoes: Array<MovimentacaoDTO> = [];

        try {

            const querySelectMovimentacao = `
                SELECT
                    m.id_movimentacao,
                    m.id_movimentacao_origem,
                    m.tipo,
                    m.motivo,
                    m.quantidade,
                    m.preco_unitario_praticado,
                    m.valor_total,
                    m.observacao,
                    m.data_movimentacao,
                    p.id_produto,
                    p.codigo,
                    p.nome
                FROM movimentacao m
                INNER JOIN produto p
                    ON p.id_produto = m.id_produto
                ORDER BY m.data_movimentacao DESC;
            `;

            const respostaBD = await database.query(querySelectMovimentacao);

            respostaBD.rows.forEach((movimentacao: any) => {

                const movimentacaoDTO: MovimentacaoDTO = {
                    id_movimentacao: movimentacao.id_movimentacao,
                    id_movimentacao_origem: movimentacao.id_movimentacao_origem,
                    tipo: movimentacao.tipo,
                    motivo: movimentacao.motivo,
                    quantidade: movimentacao.quantidade,
                    preco_unitario_praticado: movimentacao.preco_unitario_praticado,
                    valor_total: movimentacao.valor_total,
                    observacao: movimentacao.observacao,
                    data_movimentacao: movimentacao.data_movimentacao,

                    produto: {
                        id_produto: movimentacao.id_produto,
                        codigo: movimentacao.codigo,
                        nome: movimentacao.nome
                    }
                };

                listaDeMovimentacoes.push(movimentacaoDTO);
            });

            return listaDeMovimentacoes;

        } catch (error) {

            console.log(`Erro ao acessar o modelo: ${error}`);

            return null;
        }
    }

    static async listarMovimentacao(
        id_movimentacao: number
    ): Promise<MovimentacaoDTO | null> {

        try {

            const querySelectMovimentacao = `
                SELECT
                    m.id_movimentacao,
                    m.id_movimentacao_origem,
                    m.tipo,
                    m.motivo,
                    m.quantidade,
                    m.preco_unitario_praticado,
                    m.valor_total,
                    m.observacao,
                    m.data_movimentacao,
                    p.id_produto,
                    p.codigo,
                    p.nome
                FROM movimentacao m
                INNER JOIN produto p
                    ON p.id_produto = m.id_produto
                WHERE m.id_movimentacao = $1;
            `;

            const respostaBD = await database.query(
                querySelectMovimentacao,
                [id_movimentacao]
            );

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const movimentacao = respostaBD.rows[0];

            const movimentacaoDTO: MovimentacaoDTO = {
                id_movimentacao: movimentacao.id_movimentacao,
                id_movimentacao_origem: movimentacao.id_movimentacao_origem,
                tipo: movimentacao.tipo,
                motivo: movimentacao.motivo,
                quantidade: movimentacao.quantidade,
                preco_unitario_praticado: movimentacao.preco_unitario_praticado,
                valor_total: movimentacao.valor_total,
                observacao: movimentacao.observacao,
                data_movimentacao: movimentacao.data_movimentacao,

                produto: {
                    id_produto: movimentacao.id_produto,
                    codigo: movimentacao.codigo,
                    nome: movimentacao.nome
                }
            };

            return movimentacaoDTO;

        } catch (error) {

            console.error(`Erro ao realizar consulta: ${error}`);

            return null;
        }
    }

    static async cadastrarMovimentacao(
        movimentacao: Movimentacao
    ): Promise<boolean> {

        try {

            const queryInsertMovimentacao = `
                INSERT INTO movimentacao (
                    id_produto,
                    id_movimentacao_origem,
                    tipo,
                    motivo,
                    quantidade,
                    preco_unitario_praticado,
                    valor_total,
                    observacao
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id_movimentacao;
            `;

            const valores = [
                movimentacao.getIdProduto(),
                movimentacao.getIdMovimentacaoOrigem(),
                movimentacao.getTipo().toUpperCase(),
                movimentacao.getMotivo().toUpperCase(),
                movimentacao.getQuantidade(),
                movimentacao.getPrecoUnitarioPraticado(),
                movimentacao.getValorTotal(),
                movimentacao.getObservacao()
            ];

            const resultado = await database.query(
                queryInsertMovimentacao,
                valores
            );

            if (resultado.rows.length > 0) {

                console.log(
                    `Movimentação cadastrada com sucesso. ID: ${resultado.rows[0].id_movimentacao}`
                );

                return true;
            }

            return false;

        } catch (error) {

            console.error(`Erro ao cadastrar movimentação: ${error}`);

            return false;
        }
    }
}

export default Movimentacao;