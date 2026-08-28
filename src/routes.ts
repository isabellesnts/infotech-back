import { Router } from "express";
import ProdutoController from "./controller/ProdutoController.js";
const router = Router();


router.get("/produtos", ProdutoController.todos);
router.get("/produtos/:id", ProdutoController.um);
router.post("/produtos", ProdutoController.novo);
router.put("/produtos/:id", ProdutoController.atualizar);
router.delete("/produtos/:id", ProdutoController.remover);


export { router }