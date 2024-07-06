import express from "express";
import { 
  createEmpresa, 
  getEmpresas, 
  updateEmpresa, 
  deleteEmpresaById, 
  getAllEmpresas 
} from '../../controllers/empresaControllers/index.js';

const router = express.Router();

router.post('/create', createEmpresa);
router.get('/get', getEmpresas);
router.get('/all', getAllEmpresas); // Nueva ruta para obtener todas las empresas sin paginación
router.put('/update/:id', updateEmpresa);
router.delete('/delete/:id', deleteEmpresaById);

export default router;
