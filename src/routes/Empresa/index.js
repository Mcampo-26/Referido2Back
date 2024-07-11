import express from "express";
import {
  createEmpresa,
  getEmpresas,
  updateEmpresa,
  deleteEmpresaById,
  getAllEmpresas,
  getEmpresaById
} from "../../controllers/empresaControllers/index.js";

const router = express.Router();

router.post("/create", createEmpresa);
router.get("/get", getEmpresas);
router.get("/all", getAllEmpresas);
router.get("/:id", getEmpresaById);
router.put("/update/:id", updateEmpresa);
router.delete("/delete/:id", deleteEmpresaById);

export default router;
