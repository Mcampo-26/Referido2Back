import { Schema, model } from "mongoose";

// Esquema para el modelo de Usuario
const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String },
  role: { type: String, default: 'usuario', enum: ['usuario', 'admin'] },

 
});

export default model("Usuario", UsuarioSchema);
