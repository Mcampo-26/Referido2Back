import mongoose from 'mongoose';
import Usuario from '../../models/Usuario.js';
import Role from '../../models/Role.js';
import Empresa from '../../models/Empresa.js'; // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Controlador para el login de usuario
export const loginUsuario = async (req, res) => {
    console.log("Datos recibidos:", req.body);
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email })
            .populate('role')   // Popula el rol para obtener el nombre
            .populate('empresa'); // Popula la empresa para obtener el nombre

        if (usuario && await bcrypt.compare(password, usuario.password)) {
            console.log("Contraseña correcta");

            // Crear el token JWT
            const token = jwt.sign(
                { id: usuario._id, role: usuario.role.name }, // Datos que quieres almacenar en el token
                process.env.JWT_SECRET, // Clave secreta para firmar el token
                { expiresIn: '1h' } // Expiración del token (1 hora en este caso)
            );

            res.json({ message: "Login exitoso", usuario, token });
        } else {
            res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        console.error("Error durante el login:", error);
        res.status(500).send(error.message);
    }
};


// Controlador para el logout de usuario
export const logoutUsuario = async (req, res) => {
    try {
        res.clearCookie('tu_cookie_de_sesion');
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al cerrar la sesión' });
    }
};

// Controlador para crear un usuario
export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, empresa: empresaNombre } = req.body;

        // Buscar el ID de la empresa usando el nombre
        const empresa = await Empresa.findOne({ name: empresaNombre });
        if (!empresa) {
            return res.status(400).json({ message: 'La empresa especificada no existe' });
        }

        // Verificar si el usuario o correo ya existen
        const existingUser = await Usuario.findOne({
            $or: [{ nombre }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Usuario o correo electrónico ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = new Usuario({ 
            nombre, 
            email, 
            password: hashedPassword,
            empresa: empresa._id  // Asignar el ObjectId de la empresa
        });

        await usuario.save();
        res.status(201).json({ message: "Usuario creado exitosamente", usuario });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).send(error.message);
    }
};

// Controlador para obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const usuarios = await Usuario.find()
            .populate('role', 'name') 
            .populate('empresa', 'name')// Popula el campo role y solo trae el campo name
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Usuario.countDocuments();
        res.status(200).json({
            usuarios,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
// Controlador para obtener usuarios por empresa
export const getUsuariosByEmpresa = async (req, res) => {
    const { empresaId } = req.params;

    try {
        // Verifica si el empresaId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(empresaId)) {
            return res.status(400).send('ID de empresa no válido');
        }

        // Asegúrate de usar `new` para crear un ObjectId
        const objectId = new mongoose.Types.ObjectId(empresaId);

        const usuarios = await Usuario.find({ empresa: objectId })
            .populate('role')
            .populate('empresa');

        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios por empresa:', error);
        res.status(500).send(error.message);
    }
};

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, direccion, telefono, role, empresa } = req.body;

        console.log("Datos recibidos para actualizar:", { id, nombre, email, direccion, telefono, role, empresa });

        // Validar el rol
        if (role) {
            const roleDocument = await Role.findById(role);
            if (!roleDocument) {
                console.error("El rol especificado no existe:", role);
                return res.status(400).send("El rol especificado no existe.");
            }
            console.log("Rol encontrado:", roleDocument);
        }

        // Validar la empresa
        if (empresa) {
            const empresaDocument = await Empresa.findById(empresa);
            if (!empresaDocument) {
                console.error("La empresa especificada no existe:", empresa);
                return res.status(400).send("La empresa especificada no existe.");
            }
            console.log("Empresa encontrada:", empresaDocument);
        }

        // Preparar datos para la actualización
        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (email !== undefined) updateData.email = email;
        if (direccion !== undefined) updateData.direccion = direccion;
        if (telefono !== undefined) updateData.telefono = telefono;
        if (role !== undefined) updateData.role = role;
        if (empresa !== undefined) updateData.empresa = empresa;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!usuarioActualizado) {
            console.error("Usuario no encontrado:", id);
            return res.status(404).send("Usuario no encontrado");
        }

        console.log("Usuario actualizado exitosamente:", usuarioActualizado);
        res.status(200).json({ message: "Usuario actualizado exitosamente", usuario: usuarioActualizado });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send("Error al actualizar usuario");
    }
};


// Controlador para eliminar un usuario por ID
export const deleteUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResult = await Usuario.findByIdAndDelete(id);
        if (!deleteResult) {
            return res.status(404).json({ error: 'No se pudo encontrar el usuario con el ID proporcionado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al eliminar el usuario' });
    }
};

// Controlador para agregar un producto a favoritos
