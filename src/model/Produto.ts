import type ProdutoDTO from "../dto/ProdutoDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Produto {

    private id_produto: number = 0;

    private id_categoria: number;

    private codigo: string;

    private nome: string;

    private descricao: string;

    private preco_unitario: number;


    private quantidade_disponivel: number;

    private quantidade_minima: number;

    private ativo: boolean = true;

    private data_cadastro: Date;

    constructor(
        _id_categoria: number,

        _codigo: string,

        _nome: string,

        _descricao: string,

        _preco_unitario: number,

        _quantidade_disponivel: number,

        _quantidade_minima: number,

        _ativo?: boolean,

        _data_cadastro?: Date

    ) {
        this.id_categoria = _id_categoria;

        this.codigo = _codigo;

        this.nome = _nome;

        this.descricao = _descricao;

        this.preco_unitario = _preco_unitario;

        this.quantidade_disponivel = _quantidade_disponivel;

        this.quantidade_minima = _quantidade_minima;

        this.ativo = _ativo ?? true;
        
        this.data_cadastro = _data_cadastro ?? new Date();
    }




    public getIdProduto(): number {
        return this.id_produto;
    }

    public setIdProduto(value: number): void {
        this.id_produto = value;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }

    public setIdCategoria(value: number): void {
        this.id_categoria = value;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(value: string): void {
        this.codigo = value;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(value: string): void {
        this.nome = value;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public setDescricao(value: string): void {
        this.descricao = value;
    }

    public getPrecoUnitario(): number {
        return this.preco_unitario;
    }

    public setPrecoUnitario(value: number): void {
        this.preco_unitario = value;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidade_disponivel;
    }

    public setQuantidadeDisponivel(value: number): void {
        this.quantidade_disponivel = value;
    }

    public getQuantidadeMinima(): number {
        return this.quantidade_minima;
    }

    public setQuantidadeMinima(value: number): void {
        this.quantidade_minima = value;
    }

    public getAtivo(): boolean {
        return this.ativo;
    }

    public setAtivo(value: boolean): void {
        this.ativo = value;
    }

    public getDataCadastro(): Date {
        return this.data_cadastro;
    }

    public setDataCadastro(value: Date): void {
        this.data_cadastro = value;
    }



    private static toDTO(linha: any): ProdutoDTO {
        return {
            id_produto: linha.id_produto,
            codigo: linha.codigo,
            nome: linha.nome,
            descricao: linha.descricao,
            preco_unitario: linha.preco_unitario,
            quantidade_disponivel: linha.quantidade_disponivel,
            quantidade_minima: linha.quantidade_minima,
            ativo: linha.ativo,
            data_cadastro: linha.data_cadastro,

            categoria: {
                id_categoria: linha.id_categoria,
                nome: linha.nome_categoria
            }
        };
    }




    static async listarProdutos(): Promise<ProdutoDTO[]> {
        try {

            const querySelectProduto = `
                SELECT
                    p.id_produto,
                    p.id_categoria,
                    p.codigo,
                    p.nome,
                    p.descricao,
                    p.preco_unitario,
                    p.quantidade_disponivel,
                    p.quantidade_minima,
                    p.ativo,
                    p.data_cadastro,

                    c.nome AS nome_categoria

                FROM Produto p

                JOIN Categoria c
                    ON p.id_categoria = c.id_categoria

                WHERE p.ativo = TRUE;
            `;

            const respostaBD = await database.query(querySelectProduto);

            return respostaBD.rows.map(Produto.toDTO);

        } catch (error) {

            console.error(
                `[ProdutoModel] Erro ao listar produtos:`,
                error
            );

            throw error;
        }
    }




    static async listarProduto(id_produto: number): Promise<ProdutoDTO> {
        try {

            const querySelectProduto = `
                SELECT
                    p.id_produto,
                    p.id_categoria,
                    p.codigo,
                    p.nome,
                    p.descricao,
                    p.preco_unitario,
                    p.quantidade_disponivel,
                    p.quantidade_minima,
                    p.ativo,
                    p.data_cadastro,

                    c.nome AS nome_categoria

                FROM Produto p

                JOIN Categoria c
                    ON p.id_categoria = c.id_categoria

                WHERE p.id_produto = $1;
            `;

            const respostaBD = await database.query(
                querySelectProduto,
                [id_produto]
            );

            if (respostaBD.rows.length === 0) {
                throw new Error(
                    `Produto com ID ${id_produto} não encontrado.`
                );
            }

            return Produto.toDTO(respostaBD.rows[0]);

        } catch (error) {

            console.error(
                `[ProdutoModel] Erro ao buscar produto (id: ${id_produto}):`,
                error
            );

            throw error;
        }
    }




    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {

            const queryInsertProduto = `
                INSERT INTO Produto (
                    id_categoria,
                    codigo,
                    nome,
                    descricao,
                    preco_unitario,
                    quantidade_disponivel,
                    quantidade_minima,
                    ativo,
                    data_cadastro
                )

                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                )

                RETURNING id_produto;
            `;

            const valores = [
                produto.id_categoria,
                produto.codigo,
                produto.nome,
                produto.descricao,
                produto.preco_unitario,
                produto.quantidade_disponivel,
                produto.quantidade_minima,
                produto.ativo,
                produto.data_cadastro
            ];

            const resultado = await database.query(
                queryInsertProduto,
                valores
            );

            if (resultado.rows.length === 0) {
                throw new Error(
                    "INSERT não retornou ID — cadastro pode ter falhado."
                );
            }

            console.info(
                `[ProdutoModel] Produto cadastrado com sucesso. ID: ${resultado.rows[0].id_produto}`
            );

            return true;

        } catch (error) {

            console.error(
                `[ProdutoModel] Erro ao cadastrar produto:`,
                error
            );

            throw error;
        }
    }



    static async atualizarProduto(
        id_produto: number,
        id_categoria: number,
        codigo: string,
        nome: string,
        descricao: string,
        preco_unitario: number,
        quantidade_disponivel: number,
        quantidade_minima: number,
        ativo: boolean
    ): Promise<boolean> {

        try {

            const queryUpdateProduto = `
                UPDATE Produto

                SET
                    id_categoria = $1,
                    codigo = $2,
                    nome = $3,
                    descricao = $4,
                    preco_unitario = $5,
                    quantidade_disponivel = $6,
                    quantidade_minima = $7,
                    ativo = $8

                WHERE id_produto = $9

                RETURNING id_produto;
            `;

            const valores = [
                id_categoria,
                codigo,
                nome,
                descricao,
                preco_unitario,
                quantidade_disponivel,
                quantidade_minima,
                ativo,
                id_produto
            ];

            const resultado = await database.query(
                queryUpdateProduto,
                valores
            );

            if (resultado.rowCount === 0) {
                throw new Error(
                    `Produto com ID ${id_produto} não encontrado.`
                );
            }

            return true;

        } catch (error) {

            console.error(
                `[ProdutoModel] Erro ao atualizar produto (id: ${id_produto}):`,
                error
            );

            throw error;
        }
    }



    static async removerProduto(id_produto: number): Promise<boolean> {

        try {

            const queryDeleteProduto = `
                UPDATE Produto

                SET ativo = FALSE

                WHERE id_produto = $1;
            `;

            const respostaBD = await database.query(
                queryDeleteProduto,
                [id_produto]
            );

            if (respostaBD.rowCount === 0) {
                throw new Error(
                    `Produto com ID ${id_produto} não encontrado.`
                );
            }

            console.info(
                `[ProdutoModel] Produto removido com sucesso. ID: ${id_produto}`
            );

            return true;

        } catch (error) {

            console.error(
                `[ProdutoModel] Erro ao remover produto (id: ${id_produto}):`,
                error
            );

            throw error;
        }
    }
}

export default Produto;