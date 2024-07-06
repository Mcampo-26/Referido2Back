import { Schema, model } from "mongoose";

// Esquema para el modelo de Servicio
const ServicioSchema = new Schema({
  name: { type: String, required: [true, "Nombre es requerido"] },
  // Puedes agregar otros campos aquí según las necesidades de tu aplicación
});

export default model("Servicio", ServicioSchema);
