import mongoose from "mongoose";

const QRSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  value: {
    type: String,
    required: true,
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
});

export default mongoose.model("Qr", QRSchema);
