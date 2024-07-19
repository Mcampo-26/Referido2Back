// controllers/pdfControllers/index.js
import PDFDocument from 'pdfkit';
import Pdf from '../../models/Pdf.js';

// Crear PDF
export const createPdf = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPdf = new Pdf({ title, content });
    await newPdf.save();
    res.status(201).json(newPdf);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los PDFs
export const getPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.status(200).json(pdfs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener PDF por ID
export const getPdfById = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF no encontrado" });

    res.status(200).json(pdf);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Descargar PDF por ID
export const downloadPdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF no encontrado" });

    const doc = new PDFDocument();
    res.setHeader('Content-disposition', 'attachment; filename=document.pdf');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(25).text(pdf.title, {
      align: 'center'
    });

    doc.moveDown();
    doc.fontSize(14).text(pdf.content);

    doc.end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar PDF
export const updatePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF no encontrado" });

    pdf.title = req.body.title || pdf.title;
    pdf.content = req.body.content || pdf.content;

    await pdf.save();
    res.status(200).json(pdf);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar PDF
export const deletePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findByIdAndDelete(req.params.id);
    if (!pdf) return res.status(404).json({ message: "PDF no encontrado" });

    res.status(200).json({ message: "PDF eliminado con éxito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
