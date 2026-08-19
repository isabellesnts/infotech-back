-- ===================================================================
-- Sistema de Controle de Estoque - InfoTech Informatica
-- Script de criacao do banco de dados
-- ===================================================================

CREATE TABLE categoria (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE produto (
    id_produto INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INTEGER NOT NULL REFERENCES categoria(id_categoria),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0),
    quantidade_disponivel INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_disponivel >= 0),
    quantidade_minima INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_minima >= 0),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE movimentacao (
    id_movimentacao BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_produto INTEGER NOT NULL REFERENCES produto(id_produto),
    id_movimentacao_origem BIGINT REFERENCES movimentacao(id_movimentacao),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA')),
    motivo VARCHAR(20) NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario_praticado NUMERIC(10,2),
    valor_total NUMERIC(12,2),
    observacao VARCHAR(255) NOT NULL,
    data_movimentacao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===================================================================
-- Trigger: soft delete de produto (nunca apaga fisicamente, so
-- desativa o produto e bloqueia a exclusao caso existam
-- movimentacoes vinculadas).
-- ===================================================================
CREATE OR REPLACE FUNCTION fn_soft_delete_produto()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produto SET ativo = FALSE WHERE id_produto = OLD.id_produto;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_soft_delete_produto
    BEFORE DELETE ON produto
    FOR EACH ROW
    EXECUTE FUNCTION fn_soft_delete_produto();

-- ===================================================================
-- Trigger: atualiza a quantidade_disponivel do produto a cada
-- movimentacao de ENTRADA ou SAIDA registrada.
-- ===================================================================
CREATE OR REPLACE FUNCTION fn_atualiza_estoque()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'ENTRADA' THEN
        UPDATE produto
           SET quantidade_disponivel = quantidade_disponivel + NEW.quantidade
         WHERE id_produto = NEW.id_produto;
    ELSIF NEW.tipo = 'SAIDA' THEN
        UPDATE produto
           SET quantidade_disponivel = quantidade_disponivel - NEW.quantidade
         WHERE id_produto = NEW.id_produto;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_atualiza_estoque
    AFTER INSERT ON movimentacao
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualiza_estoque();
