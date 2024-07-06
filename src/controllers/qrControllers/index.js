import qr from 'qr-image';
import Qr from "../../models/Qr.js";
import Usuario from "../../models/Usuario.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Crear QR

export const createQr = async (req, res) => {
  try {
    const { userId, assignedTo, empresaId, value, nombre, telefono, mail, startTime, endTime } = req.body;

    // Crear el objeto de QR para obtener el ID
    const newQr = new Qr({
      userId,
      assignedTo,
      empresaId,
      value,
      nombre,
      telefono,
      mail,
      startTime,
      endTime
    });

    const qrData = `id: ${newQr._id}\nTexto: ${value}\nNombre: ${nombre}\nTeléfono: ${telefono}\nCorreo: ${mail}\nHora de inicio: ${startTime}\nHora de fin: ${endTime}`;
    const qrImage = qr.imageSync(qrData, { type: 'png', ec_level: 'M', size: 10, margin: 1 });
    const base64Image = qrImage.toString('base64');

    // Asignar la imagen base64 al QR antes de guardarlo
    newQr.base64Image = base64Image;

    await newQr.save();
    res.status(201).json({ message: "QR creado exitosamente", newQr });
  } catch (error) {
    console.error("Error en createQr:", error);
    res.status(400).send(error.message);
  }
};





export const getQrsByAssignedUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const qrs = await Qr.find({ assignedTo: userId })
                        .populate('empresaId', 'name')
                        .populate('assignedTo', 'nombre');
    res.status(200).json(qrs);
  } catch (error) {
    console.error("Error en getQrsByAssignedUser:", error);
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
// controllers/qrControllers/index.js

export const updateQr = async (req, res) => {
  try {
    const { id } = req.params;
    const { service, details, isUsed } = req.body;
    
    const updatedQr = await Qr.findByIdAndUpdate(
      id,
      { $set: { service, details, isUsed } },
      { new: true }
    );

    if (!updatedQr) {
      return res.status(404).send("QR no encontrado");
    }

    res.status(200).json({ message: "QR actualizado exitosamente", qr: updatedQr });
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
    qr.isUsed = true; // Marcar como usado
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
