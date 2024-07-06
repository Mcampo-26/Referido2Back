import express from "express";
import {
  createServicio,
  getServicios,
  updateServicio,
  deleteServicioById,
  getAllServicios,
} from "../../controllers/servicioControllers/index.js";

const router = express.Router();

router.post("/create", createServicio);
router.get("/get", getServicios);
router.get("/all", getAllServicios); // Nueva ruta para obtener todos los servicios sin paginación
router.put("/update/:id", updateServicio);
router.delete("/delete/:id", deleteServicioById);

export default router;
