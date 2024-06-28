import { Schema, model } from "mongoose";

const QrSchema = new Schema({
  value: { type: String, required: true },       // Valor del QR
  nombre: { type: String, required: true },      // Nombre del usuario asociado con el QR
  telefono: { type: String, required: false},    // Teléfono del usuario
  mail: { type: String, required: true },        // Correo electrónico del usuario
  usageCount: { type: Number, default: 0 },      // Contador de usos del QR
  startTime: { type: String, required: true },   // Hora de inicio permitida (HH:MM)
  endTime: { type: String, required: true },     // Hora de finalización permitida (HH:MM)
  createdAt: { type: Date, default: Date.now },  // Fecha de creación
});

export default model("Qr", QrSchema);
