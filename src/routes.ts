import { Router } from "express";
import ProdutoController from "./controller/ProdutoController.js";
import {Auth} from "./middlewares/Auth.js";
import MovimentacaoController from "./controller/MovimentacaoController.js";
import CategoriaController from "./controller/CategoriaController.js";
const router = Router();


router.get("/produtos", ProdutoController.todos);
router.post("/produtos", ProdutoController.novo);
router.get("/produtos/:id_produto", ProdutoController.um);
router.put("/produtos/:id_produto", ProdutoController.atualizar);
router.delete("/produtos/:id_produto", ProdutoController.remover);



router.get("/movimentacoes", MovimentacaoController.todos);
router.get("/movimentacoes/:id_movimentacao", MovimentacaoController.um);
router.post("/movimentacoes", MovimentacaoController.novo);





router.get("/categorias", CategoriaController.todos);
router.get("/categorias/:id", CategoriaController.categoria);
router.post("/categorias", CategoriaController.cadastrar);
router.put("/categorias/:id", CategoriaController.atualizar);
router.delete("/categorias/:id", CategoriaController.remover);


router.post("/login", Auth.validacaoUsuario);




export { router }