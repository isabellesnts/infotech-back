import type CategoriaDTO from "../dto/CategoriaDTO.js";
import { DatabaseModel } from "./DataBaseModel.js";

const database = new DatabaseModel().pool;

class Categoria {

    private id_categoria: number = 0;
    private nome: string;

    constructor(_nome: string) {
        this.nome = _nome;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }

    public setIdCategoria(value: number) {
        this.id_categoria = value;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(value: string) {
        this.nome = value;
    }

    static async listarCategorias(): Promise<Array<CategoriaDTO> | null> {

        let listaDeCategorias: Array<CategoriaDTO> = [];

        try {

            const querySelectCategoria = `
                SELECT *
                FROM categoria
                ORDER BY nome;
            `;

            const respostaBD = await database.query(querySelectCategoria);

            respostaBD.rows.forEach((categoria) => {

                const categoriaDTO: CategoriaDTO = {
                    id_categoria: categoria.id_categoria,
                    nome: categoria.nome
                };

                listaDeCategorias.push(categoriaDTO);
            });

            return listaDeCategorias;

        } catch (error) {

            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    static async listarCategoria(
        id_categoria: number
    ): Promise<CategoriaDTO | null> {

        try {

            const querySelectCategoria = `
                SELECT *
                FROM categoria
                WHERE id_categoria = $1;
            `;

            const respostaBD = await database.query(
                querySelectCategoria,
                [id_categoria]
            );

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const categoriaDTO: CategoriaDTO = {
                id_categoria: respostaBD.rows[0].id_categoria,
                nome: respostaBD.rows[0].nome
            };

            return categoriaDTO;

        } catch (error) {

            console.error(`Erro ao realizar consulta: ${error}`);
            return null;
        }
    }

    static async cadastrarCategoria(
        categoria: Categoria
    ): Promise<boolean> {

        try {

            const queryInsertCategoria = `
                INSERT INTO categoria (nome)
                VALUES ($1)
                RETURNING id_categoria;
            `;

            const resultado = await database.query(
                queryInsertCategoria,
                [categoria.getNome().toUpperCase()]
            );

            if (resultado.rows.length > 0) {

                console.log(
                    `Categoria cadastrada com sucesso. ID: ${resultado.rows[0].id_categoria}`
                );

                return true;
            }

            return false;

        } catch (error) {

            console.error(`Erro ao cadastrar categoria: ${error}`);
            return false;
        }
    }

    static async atualizarCategoria(
        categoria: Categoria
    ): Promise<boolean> {

        try {

            const categoriaConsulta: CategoriaDTO | null =
                await this.listarCategoria(
                    categoria.getIdCategoria()
                );

            if (categoriaConsulta) {

                const queryAtualizarCategoria = `
                    UPDATE categoria
                    SET nome = $1
                    WHERE id_categoria = $2;
                `;

                const respostaBD = await database.query(
                    queryAtualizarCategoria,
                    [
                        categoria.getNome().toUpperCase(),
                        categoria.getIdCategoria()
                    ]
                );

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

    static async removerCategoria(
        id_categoria: number
    ): Promise<boolean> {

        try {

            const categoria: CategoriaDTO | null =
                await this.listarCategoria(id_categoria);

            if (!categoria) {
                return false;
            }

            const queryVerificarProdutos = `
                SELECT id_produto
                FROM produto
                WHERE id_categoria = $1
                LIMIT 1;
            `;

            const produtos = await database.query(
                queryVerificarProdutos,
                [id_categoria]
            );

            if (produtos.rows.length > 0) {
                return false;
            }

            const queryDeleteCategoria = `
                DELETE FROM categoria
                WHERE id_categoria = $1;
            `;

            const resultado = await database.query(
                queryDeleteCategoria,
                [id_categoria]
            );

            return resultado.rowCount != 0;

        } catch (error) {

            console.log(`Erro ao remover categoria: ${error}`);
            return false;
        }
    }
}

export default Categoria;