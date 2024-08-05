import express from 'express';
import { 
  createQr, 
  getQrs, 
  getQrById, 
  updateQr, 
  deleteQrById, 
  useQr, 
  generateQr, 
  getQrsByAssignedUser, 
  getQrsByUser 
} from '../../controllers/qrControllers/index.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/generate-qr', generateQr);
router.post('/create', authMiddleware, createQr);
router.get('/get', authMiddleware, getQrs);
router.get('/assigned/:userId', authMiddleware, getQrsByAssignedUser);
router.get('/by-user', authMiddleware, getQrsByUser);
router.get('/:id', authMiddleware, getQrById);
router.put('/update/:id', authMiddleware, updateQr);
router.delete('/delete/:id', authMiddleware, deleteQrById);
router.post('/use/:id', authMiddleware, useQr);

export default router;
