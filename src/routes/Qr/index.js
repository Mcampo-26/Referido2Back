import express from "express";
import { createQr, getQrs, getQrById, updateQr, deleteQrById, useQr, generateQr, getQrsByAssignedUser } from '../../controllers/qrControllers/index.js';

const router = express.Router();

router.get('/generate-qr', generateQr);
router.post('/create', createQr);
router.get('/get', getQrs);

router.get('/assigned/:userId', getQrsByAssignedUser); // Nueva ruta para obtener los QR Codes asignados a un usuario
router.get('/:id', getQrById);
router.put('/update/:id', updateQr); // Asegúrate de que esta ruta coincide con la URL en el cliente
router.delete('/delete/:id', deleteQrById);
router.post('/use/:id', useQr);

export default router;
