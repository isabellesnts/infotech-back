import { Router } from "express";
import { categoriaController } from "../controllers/categoriaController";
import { validarCategoria, validarIdParam } from "../middlewares/categoriaValidator";

const router = Router();

router.get("/", categoriaController.listar);
router.get("/:id", validarIdParam, categoriaController.buscarPorId);
router.get("/:id/produtos", validarIdParam, categoriaController.listarProdutos);
router.post("/", validarCategoria, categoriaController.criar);
router.put("/:id", validarIdParam, validarCategoria, categoriaController.atualizar);
router.delete("/:id", validarIdParam, categoriaController.remover);

export default router;
