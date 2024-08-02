import express from "express";
import { createUsuario, getUsuarios, updateUsuario, deleteUsuarioById, loginUsuario, logoutUsuario, getUsuariosByEmpresa } from "../../controllers/usuariosControllers/Index.js";

const router = express.Router();

router.post('/create', createUsuario);
router.get('/get', getUsuarios);  // Esta ruta obtiene todos los usuarios, probablemente usada por un SuperAdmin
router.get('/empresa/:empresaId', getUsuariosByEmpresa);  // Esta ruta obtiene usuarios por empresa
router.put('/update/:id', updateUsuario);
router.delete('/delete/:id', deleteUsuarioById);
router.post('/login', loginUsuario);
router.post('/logout', logoutUsuario);

export default router;
