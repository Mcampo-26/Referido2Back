import { Schema, model } from "mongoose";

// Esquema para el modelo de Role
const RoleSchema = new Schema({
  name: { type: String, required: [true, "Nombre es requerido"] },
});

export default model("Role", RoleSchema);
