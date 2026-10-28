import { Router } from "express";
import ProdutoController from "./controller/ProdutoController.js";
import {Auth} from "./middlewares/Auth.js";
import MovimentacaoController from "./controller/MovimentacaoController.js";
import CategoriaController from "./controller/CategoriaController.js";
import RelatorioController from "./controller/RelatorioController.js";
const router = Router();

router.get("/produtos", Auth.verifyToken, ProdutoController.todos);
router.get("/produtos/:id", Auth.verifyToken, ProdutoController.um);
router.post("/produtos", Auth.verifyToken, ProdutoController.novo);
router.put("/produtos/:id", Auth.verifyToken, ProdutoController.atualizar);
router.delete("/produtos/:id", Auth.verifyToken, ProdutoController.remover);

router.get("/movimentacoes", Auth.verifyToken, MovimentacaoController.todos);
router.get("/movimentacoes/:id_movimentacao", Auth.verifyToken, MovimentacaoController.um);
router.post("/movimentacoes", Auth.verifyToken, MovimentacaoController.novo);

router.get("/categorias", Auth.verifyToken, CategoriaController.todos);
router.get("/categorias/:id", Auth.verifyToken, CategoriaController.categoria);
router.post("/categorias", Auth.verifyToken, CategoriaController.cadastrar);
router.put("/categorias/:id", Auth.verifyToken, CategoriaController.atualizar);
router.delete("/categorias/:id", Auth.verifyToken, CategoriaController.remover);

router.get("/relatorios/reposicao", Auth.verifyToken, RelatorioController.reposicao);
router.get("/relatorios/valor-produto", Auth.verifyToken, RelatorioController.valorProduto);
router.get("/relatorios/valor-total", Auth.verifyToken, RelatorioController.valorTotal);

router.post("/login", Auth.validacaoUsuario);

export { router }