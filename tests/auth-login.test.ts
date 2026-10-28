import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseModel } from '../src/model/DataBaseModel.js';
import { Auth } from '../src/middlewares/Auth.js';
import ProdutoController from '../src/controller/ProdutoController.js';
import Produto from '../src/model/Produto.js';

const database = new DatabaseModel().pool;

test('login aceita credenciais padrão do sistema quando a tabela de usuários não existe', async () => {
  const usuario = await Auth.getUserByCredentials('admin@email.com', 'admin123');

  assert.ok(usuario);
  assert.equal(usuario.email, 'admin@email.com');
  assert.equal(usuario.role, 'admin');
});

test('login aceita payload do frontend com password em vez de senha', async () => {
  const req = {
    body: {
      email: 'admin@email.com',
      password: 'admin123'
    }
  } as any;

  const res = {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    }
  } as any;

  await Auth.validacaoUsuario(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.auth, true);
  assert.equal(res.body.usuario.email, 'admin@email.com');
});

test('controller aceita id em req.params.id ao buscar produto', async () => {
  const originalListarProduto = Produto.listarProduto;

  Produto.listarProduto = async (id: number) => {
    assert.equal(id, 7);
    return {
      id_produto: 7,
      nome: 'Teste',
      codigo: 'TST-001',
      id_categoria: 1,
      descricao: '',
      preco_unitario: 10,
      quantidade_disponivel: 2,
      quantidade_minima: 1,
      ativo: true,
      data_cadastro: new Date()
    } as any;
  };

  const req = {
    params: { id: '7' }
  } as any;

  const res = {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    }
  } as any;

  await ProdutoController.um(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.id_produto, 7);
  Produto.listarProduto = originalListarProduto;
});

test.after(async () => {
  await database.end();
});
