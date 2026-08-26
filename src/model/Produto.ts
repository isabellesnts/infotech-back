import type ProdutoDTO from "../dto/ProdutoDTO.js";
import {DatabaseModel} from "../model/DataBaseModel.js";

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

    constructor(
        _id_categoria: number,
        _codigo: string,
        _nome: string,
        _descricao: string,
        _preco_unitario: number,
        _quantidade_disponivel: number,
        _quantidade_minima: number
    ) {
        this.id_categoria = _id_categoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao;
        this.preco_unitario = _preco_unitario;
        this.quantidade_disponivel = _quantidade_disponivel;
        this.quantidade_minima = _quantidade_minima;
    }

    public getIdProduto(): number {
        return this.id_produto;
    }
    public setIdProduto(value: number) {
        this.id_produto = value;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }
    public setIdCategoria(value: number) {
        this.id_categoria = value;
    }

    public getCodigo(): string {
        return this.codigo;
    }
    public setCodigo(value: string) {
        this.codigo = value;
    }

    public getNome(): string {
        return this.nome;
    }
    public setNome(value: string) {
        this.nome = value;
    }

    public getDescricao(): string {
        return this.descricao;
    }
    public setDescricao(value: string) {
        this.descricao = value;
    }

    public getPrecoUnitario(): number {
        return this.preco_unitario;
    }
    public setPrecoUnitario(value: number) {
        this.preco_unitario = value;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidade_disponivel;
    }
    public setQuantidadeDisponivel(value: number) {
        this.quantidade_disponivel = value;
    }

    public getQuantidadeMinima(): number {
        return this.quantidade_minima;
    }
    public setQuantidadeMinima(value: number) {
        this.quantidade_minima = value;
    }

    public getAtivo(): boolean {
        return this.ativo;
    }
    public setAtivo(value: boolean) {
        this.ativo = value;
    }

    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {
        let listaDeProdutos: Array<ProdutoDTO> = [];

        try {
            const querySelectProduto = `SELECT * FROM produto WHERE ativo = TRUE;`;
            const respostaBD = await database.query(querySelectProduto);

            respostaBD.rows.forEach((produto) => {
                const produtoDTO: ProdutoDTO = {
                    id_produto: produto.id_produto,
                    id_categoria: produto.id_categoria,
                    codigo: produto.codigo,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco_unitario: produto.preco_unitario,
                    quantidade_disponivel: produto.quantidade_disponivel,
                    quantidade_minima: produto.quantidade_minima,
                    ativo: produto.ativo,
                    data_cadastro: produto.data_cadastro
                };
                listaDeProdutos.push(produtoDTO);
            });

            return listaDeProdutos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async listarProduto(id_produto: number): Promise<ProdutoDTO | null> {
        try {
            const querySelectProduto = `SELECT * FROM produto WHERE id_produto = $1`;
            const respostaBD = await database.query(querySelectProduto, [id_produto]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const produtoDTO: ProdutoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_categoria: respostaBD.rows[0].id_categoria,
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                quantidade_disponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidade_minima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro
            };

            return produtoDTO;
        } catch (error) {
            console.error(`Erro ao realizar consulta. ${error}`);
            return null;
        }
    }

    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {
            const queryInsertProduto = `
                INSERT INTO produto (id_categoria, codigo, nome, descricao, preco_unitario, quantidade_disponivel, quantidade_minima)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id_produto;`;

            const valores = [
                produto.getIdCategoria(),
                produto.getCodigo().toUpperCase(),
                produto.getNome().toUpperCase(),
                produto.getDescricao(),
                produto.getPrecoUnitario(),
                produto.getQuantidadeDisponivel(),
                produto.getQuantidadeMinima()
            ];

            const result = await database.query(queryInsertProduto, valores);

            if (result.rows.length > 0) {
                console.log(`Produto cadastrado com sucesso. ID: ${result.rows[0].id_produto}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    static async removerProduto(id_produto: number): Promise<boolean> {
        try {
            const produto: ProdutoDTO | null = await this.listarProduto(id_produto);

            if (produto && produto.ativo) {
                const queryDeleteProduto = `UPDATE produto
                          SET ativo = FALSE 
                          WHERE id_produto = $1`;

                const result = await database.query(queryDeleteProduto, [id_produto]);

                return result.rowCount != 0;
            }

            return false;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

    static async atualizarProduto(produto: Produto): Promise<boolean> {
        try {
            const produtoConsulta: ProdutoDTO | null = await this.listarProduto(produto.getIdProduto());

            if (produtoConsulta && produtoConsulta.ativo) {
                const queryAtualizarProduto = `UPDATE produto SET 
                                id_categoria = $1, 
                                codigo = $2,
                                nome = $3, 
                                descricao = $4,
                                preco_unitario = $5, 
                                quantidade_disponivel = $6,
                                quantidade_minima = $7
                             WHERE id_produto = $8`;

                const valores = [
                    produto.getIdCategoria(),
                    produto.getCodigo().toUpperCase(),
                    produto.getNome().toUpperCase(),
                    produto.getDescricao(),
                    produto.getPrecoUnitario(),
                    produto.getQuantidadeDisponivel(),
                    produto.getQuantidadeMinima(),
                    produto.getIdProduto()
                ];

                const respostaBD = await database.query(queryAtualizarProduto, valores);

                if (respostaBD.rowCount != 0) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }
}

export default Produto;