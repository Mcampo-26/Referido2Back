import express from "express";
import {
  createServicio,
  getServicios,
  updateServicio,
  deleteServicioById,
  getAllServicios,
  getServiciosByEmpresaId, // Asegúrate de importar esta función
} from "../../controllers/servicioControllers/index.js";

const router = express.Router();

router.post("/create", createServicio);
router.get("/get", getServicios);
router.get("/all", getAllServicios);
router.get("/byEmpresa/:empresaId", getServiciosByEmpresaId); // Agrega esta línea
router.put("/update/:id", updateServicio);
router.delete("/delete/:id", deleteServicioById);

export default router;
