import { Schema, model } from "mongoose";

// Esquema para el modelo de Servicio
const ServicioSchema = new Schema({
  name: { type: String, required: [true, "Nombre es requerido"] },
  empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true }
});

export default model("Servicio", ServicioSchema);
