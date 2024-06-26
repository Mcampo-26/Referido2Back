import Qr from "../../models/Qr.js";

// Crear QR
export const createQr = async (req, res) => {
  try {
    const { value, nombre, telefono, mail, startTime, endTime } = req.body;
    const qr = new Qr({ value, nombre, telefono, mail, startTime, endTime });
    await qr.save();
    res.status(201).json({ message: "QR creado exitosamente", qr });
  } catch (error) {
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
    res.status(500).send(error.message);
  }
};
