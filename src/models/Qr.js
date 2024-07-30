import mongoose from "mongoose";

const UpdateSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servicio",
  },
  details: {
    type: String,
  },
  discount: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const QRSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  empresaId: { 
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  },
  nombre: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  maxUsageCount: { 
    type: Number,
    required: true,
  },
  base64Image: {
    type: String,
    required: true,
  },
  date: { 
    type: Date, 
    required: true 
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Servicio",
  },
  details: {
    type: String,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  updates: [UpdateSchema], // Añadir el campo de actualizaciones
});

export default mongoose.model("Qr", QRSchema);
