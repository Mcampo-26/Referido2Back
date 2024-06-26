import express from "express";
import { createQr, getQrs, getQrById, updateQr, deleteQrById, useQr } from '../../controllers/qrControllers/index.js'

const router = express.Router();

router.post('/create', createQr);
router.get('/get', getQrs);
router.get('/:id', getQrById);
router.put('/update/:id', updateQr);
router.delete('/delete/:id', deleteQrById);
router.post('/use/:id', useQr);  // Nueva ruta para usar el QR

export default router;
