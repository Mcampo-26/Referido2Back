import express from "express";
import { createRole, getRoles, updateRole, deleteRoleById, getAllRoles } from '../../controllers/rolesControllers/index.js'

const router = express.Router();

router.post('/create', createRole);
router.get('/get', getRoles);
router.get('/all', getAllRoles); // Nueva ruta para obtener todos los roles sin paginación
router.put('/update/:id', updateRole);
router.delete('/delete/:id', deleteRoleById);

export default router;
