

import qr from 'qr-image';
import Qr from "../../models/Qr.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
// Crear QR
export const createQr = async (req, res) => {
  try {
    const { value, nombre, telefono, mail, startTime, endTime } = req.body;
    const qr = new Qr({ value, nombre, telefono, mail, startTime, endTime });
    await qr.save();
    res.status(201).json({ message: "QR creado exitosamente", qr });
  } catch (error) {
    console.error("Error en createQr:", error);
    res.status(400).send(error.message);
  }
};

// Obtener todos los QRs
export const getQrs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const qrs = await Qr.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Qr.countDocuments();
    res.status(200).json({
      qrs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error en getQrs:", error);
    res.status(400).send(error.message);
  }
};

// Obtener QR por ID
export const getQrById = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await Qr.findById(id);
    if (!qr) {
      return res.status(404).json({ message: "QR no encontrado" });
    }
    res.status(200).json(qr);
  } catch (error) {
    console.error("Error en getQrById:", error);
    res.status(400).send(error.message);
  }
};

// Actualizar QR
export const updateQr = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, nombre, telefono, mail, startTime, endTime } = req.body;
    const qrActualizado = await Qr.findByIdAndUpdate(
      id,
      { value, nombre, telefono, mail, startTime, endTime },
      { new: true }
    );

    if (!qrActualizado) {
      return res.status(404).send("QR no encontrado");
    }

    res.status(200).json({ message: "QR actualizado exitosamente", qr: qrActualizado });
  } catch (error) {
    console.error("Error en updateQr:", error);
    res.status(400).send(error.message);
  }
};

// Eliminar QR
export const deleteQrById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await Qr.findByIdAndDelete(id);
    if (!deleteResult) {
      return res.status(404).json({ error: "No se pudo encontrar el QR con el ID proporcionado" });
    }
    res.status(200).json({ message: "QR eliminado exitosamente" });
  } catch (error) {
    console.error("Error en deleteQrById:", error);
    res.status(500).json({ error: "Ocurrió un error al eliminar el QR" });
  }
};

// Incrementar el contador de uso y verificar el horario de uso
export const useQr = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await Qr.findById(id);
    if (!qr) {
      return res.status(404).json({ message: "QR no encontrado" });
    }

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const [startHour, startMinute] = qr.startTime.split(':').map(Number);
    const [endHour, endMinute] = qr.endTime.split(':').map(Number);

    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    if (currentTimeInMinutes < startTimeInMinutes || currentTimeInMinutes > endTimeInMinutes) {
      return res.status(403).json({ message: "QR no se puede usar en este horario" });
    }

    qr.usageCount += 1;
    await qr.save();

    res.status(200).json({ message: "QR usado exitosamente", usageCount: qr.usageCount });
  } catch (error) {
    console.error("Error en useQr:", error);
    res.status(500).send(error.message);
  }
};

// Generar QR



// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQr = (req, res) => {
  const { text } = req.query;

  if (!text) {
    console.error("Error en generateQr: Text is required");
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const qrDir = path.join(__dirname, '../../../qrImagen');
    const fileName = `qr-code.png`;
    const qrCodePath = path.join(qrDir, fileName);

    // Verificar si el directorio `qrImagen` existe, si no, crearlo
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const qrImage = qr.image(text, { type: 'png' });
    const qrCodeStream = fs.createWriteStream(qrCodePath);

    qrImage.pipe(qrCodeStream);

    qrCodeStream.on('finish', () => {
      fs.readFile(qrCodePath, (err, data) => {
        if (err) {
          console.error("Error reading QR code file:", err);
          return res.status(500).json({ error: 'Error reading QR code file' });
        }
        const base64Image = Buffer.from(data).toString('base64');
        res.json({ base64Image });
      });
    });

    qrCodeStream.on('error', (err) => {
      console.error("Error en qrCodeStream:", err);
      res.status(500).json({ error: 'Error generating QR code' });
    });
  } catch (err) {
    console.error("Error en generateQr:", err);
    res.status(500).json({ error: 'Error generating QR code' });
  }
};