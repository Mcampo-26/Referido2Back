import express from "express";
import { createQr, getQrs, getQrById, updateQr, deleteQrById, useQr, generateQr, getQrsByUser } from '../../controllers/qrControllers/index.js';

const router = express.Router();

router.get('/generate-qr', generateQr);
router.post('/create', createQr);
router.get('/get', getQrs);
router.get('/user/:userId', getQrsByUser);  // Nueva ruta para obtener los QR Codes por usuario
router.get('/:id', getQrById);
router.put('/update/:id', updateQr);
router.delete('/delete/:id', deleteQrById);
router.post('/use/:id', useQr);

export default router;
