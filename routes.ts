import { Router } from "express";
import ProdutoController from "./src/controller/ProdutoController.js";
const router = Router();


router.get("/produtos", ProdutoController.todos);
router.get("/produtos/:id", ProdutoController.lista);
router.post("/produtos", ProdutoController.cadastro);


export { router }