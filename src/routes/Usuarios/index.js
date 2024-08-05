import express from "express";
import { createUsuario, getUsuarios, updateUsuario, deleteUsuarioById, loginUsuario, logoutUsuario, getUsuariosByEmpresa } from "../../controllers/usuariosControllers/Index.js";
import { authMiddleware } from "../../middleware/authMiddleware.js"; // Importa tu middleware

const router = express.Router();

router.post('/create', createUsuario);
router.get('/get', authMiddleware, getUsuarios);  // Protege la ruta para obtener usuarios
router.get('/empresa/:empresaId', authMiddleware, getUsuariosByEmpresa);  // Protege la ruta para obtener usuarios por empresa
router.put('/update/:id', authMiddleware, updateUsuario);
router.delete('/delete/:id', authMiddleware, deleteUsuarioById);
router.post('/login', loginUsuario);
router.post('/logout', logoutUsuario);

export default router;
