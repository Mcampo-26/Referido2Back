// routes/pdfRoutes.js
import express from "express";
import {
  createPdf,
  getPdfs,
  getPdfById,
  downloadPdf,
  updatePdf,
  deletePdf,
} from "../../controllers/pdfControllers/index.js";

const router = express.Router();

router.post("/create", createPdf);
router.get("/get", getPdfs);
router.get("/:id", getPdfById);
router.get("/download/:id", downloadPdf); // Ruta para descargar el PDF
router.put("/update/:id", updatePdf);
router.delete("/delete/:id", deletePdf);

export default router;
