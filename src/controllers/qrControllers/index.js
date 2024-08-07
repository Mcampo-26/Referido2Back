import qr from 'qr-image';
import Qr from "../../models/Qr.js";
import Empresa from '../../models/Empresa.js';
import Usuario from "../../models/Usuario.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Crear QR
export const createQr = async (req, res) => {
  try {
    const { userId, assignedTo, empresaId, nombre, telefono, mail, startTime, endTime, date, maxUsageCount } = req.body;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    const newQr = new Qr({
      userId,
      assignedTo,
      empresaId: {
        _id: empresa._id,
        name: empresa.name
      },
      nombre,
      telefono,
      mail,
      startTime,
      endTime,
      date,
      maxUsageCount,
      isUsed: false, // Asegúrate de incluir `isUsed` aquí
      usageCount: 0, // Inicializar `usageCount` a 0
    });

    const qrData = {
      id: newQr._id.toString(),
      uId: userId,
      aId: assignedTo,
      eId: empresa._id,
      eName: empresa.name,
      n: nombre,
      t: telefono,
      m: mail,
      sT: startTime,
      eT: endTime,
      d: date,
      mUC: maxUsageCount,
      uC: 0, // Inicializar `usageCount` a 0
      isUsed: false // Asegúrate de incluir `isUsed` aquí
    };

    console.log('Datos del QR a ser generados:', qrData);

    const qrString = JSON.stringify(qrData);
    const qrImage = qr.imageSync(qrString, { type: 'png', ec_level: 'H', size: 10, margin: 1 });
    const base64Image = qrImage.toString('base64');

    newQr.base64Image = base64Image;

    await newQr.save();

    res.status(201).json({
      message: "QR creado exitosamente",
      newQr: {
        ...newQr.toObject(),
        empresaId: {
          _id: empresa._id,
          name: empresa.name
        }
      }
    });
  } catch (error) {
    console.error("Error en createQr:", error);
    res.status(400).send(error.message);
  }
};

// Obtener QRs por usuario asignado
export const getQrsByAssignedUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const qrs = await Qr.find({ assignedTo: userId })
                        .populate('empresaId', 'name')
                        .populate('assignedTo', 'nombre')
                        .populate('updates.service', 'name'); // Asegúrate de poblar el servicio en las actualizaciones
    res.status(200).json(qrs);
  } catch (error) {
    console.error("Error en getQrsByAssignedUser:", error);
    res.status(400).send(error.message);
  }
};

// Obtener todos los QRs
export const getQrs = async (req, res) => {
  try {
    const { userId, role } = req.user; // Suponiendo que tienes el userId y role en el request (mediante middleware de autenticación)
    const { page = 1, limit = 10 } = req.query;

    let query = {};

    if (role === 'Admin') {
      query.userId = userId; // Filtrar por el ID del usuario (Admin)
    }

    const qrs = await Qr.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Qr.countDocuments(query);

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
    const qr = await Qr.findById(req.params.id).populate('empresaId', 'name');

    if (!qr) {
      return res.status(404).json({ message: 'QR no encontrado' });
    }

    const userRole = req.user.role; // Asumiendo que el rol del usuario está almacenado en req.user.role
    const userId = req.user.userId; // ID del usuario autenticado
    const usuario = await Usuario.findById(userId).populate('empresa');

    // Si el usuario es SuperAdmin, permite el acceso sin restricciones
    if (userRole === 'SuperAdmin') {
      return res.status(200).json(qr);
    }

    // Si el usuario es Admin, verifica si es el creador del QR o pertenece a la misma empresa
    if (userRole === 'Admin') {
      const perteneceMismaEmpresa = usuario.empresa && qr.empresaId && usuario.empresa._id.toString() === qr.empresaId._id.toString();

      if (qr.userId.toString() === userId.toString() || perteneceMismaEmpresa) {
        return res.status(200).json(qr);
      } else {
        return res.status(403).json({ message: 'Acceso denegado: no tienes permisos para acceder a este QR' });
      }
    }

    // Permitir el acceso al QR si las validaciones anteriores pasan
    return res.status(200).json(qr);
  } catch (error) {
    console.error('Error al obtener QR por ID:', error);
    res.status(500).json({ message: 'Error al obtener QR' });
  }
};


// Actualizar QR con descuento y detalles de servicio
export const updateQr = async (req, res) => {
  try {
    const { id } = req.params;
    const { service, details, discount } = req.body;

    console.log(`Buscando QR con ID: ${id}`);

    // Encuentra el QR por su ID
    const qr = await Qr.findById(id);
    if (!qr) {
      return res.status(404).send("QR no encontrado");
    }

    // Crear un nuevo objeto de actualización con la fecha actual y el descuento
    const newUpdate = {
      service,
      details,
      discount, // Añadir el descuento
      updatedAt: new Date()  // Añadir la fecha de actualización
    };

    // Agregar la nueva actualización al array de actualizaciones
    qr.updates.push(newUpdate);

    // Incrementar el uso si aún no ha alcanzado el máximo permitido
    if (qr.usageCount < qr.maxUsageCount) {
      qr.usageCount += 1;

      // Si el QR ha alcanzado el uso máximo justo después de esta actualización, lo marcamos como usado
      if (qr.usageCount >= qr.maxUsageCount) {
        qr.isUsed = true;
      }

      // Guarda el QR actualizado en la base de datos
      const updatedQr = await qr.save();
      console.log(`Uso actualizado: ${qr.usageCount}/${qr.maxUsageCount}`);
      return res.status(200).json({ message: "QR actualizado exitosamente", qr: updatedQr });
    } else {
      return res.status(400).json({ message: "El QR ya no puede ser usado." });
    }
  } catch (error) {
    console.error("Error en updateQr:", error);
    return res.status(400).json({ message: "Error al actualizar el QR", error: error.message });
  }
};

// Incrementar el contador de uso y verificar el horario de uso
export const useQr = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await Qr.findById(id);

    if (!qr) {
      return res.status(404).json({ message: 'QR no encontrado' });
    }

    // Incrementar el uso si aún no ha alcanzado el máximo
    if (qr.usageCount < qr.maxUsageCount) {
      qr.usageCount += 1;
    }

    await qr.save();
    res.status(200).json(qr);
  } catch (error) {
    res.status(500).json({ message: 'Error al usar QR', error });
  }
};

// Eliminar QR por ID
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

// Generar QR
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

export const getQrsByUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Este es el ID del usuario autenticado
    const qrs = await Qr.find({ userId })
                        .populate('empresaId', 'name');
    res.status(200).json(qrs);
  } catch (error) {
    console.error("Error en getQrsByUser:", error);
    res.status(400).send(error.message);
  }
};