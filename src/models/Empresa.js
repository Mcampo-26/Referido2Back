import { Schema, model } from "mongoose";

// Esquema para el modelo de Empresa
const EmpresaSchema = new Schema({
  name: { type: String, required: [true, "Nombre es requerido"] },
  // Puedes agregar otros campos aquí según las necesidades de tu aplicación
});

export default model("Empresa", EmpresaSchema);
