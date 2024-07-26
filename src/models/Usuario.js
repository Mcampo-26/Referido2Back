import { Schema, model } from "mongoose";

// Esquema para el modelo de Usuario
const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String },
  empresa: {type: Schema.Types.ObjectId, ref: 'Empresa',default: null },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: null }, // Referencia opcional al modelo Role
});

export default model("Usuario", UsuarioSchema);
