import Usuario from '../../models/Usuario.js';
import Role from '../../models/Role.js';
import bcrypt from 'bcryptjs';

// Controlador para el login de usuario
export const loginUsuario = async (req, res) => {
    console.log("Datos recibidos:", req.body);
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email }).populate('role'); // Popula el rol para obtener el nombre

        if (usuario && await bcrypt.compare(password, usuario.password)) {
            console.log("Contraseña correcta");
            res.json({ message: "Login exitoso", usuario });
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
        const { nombre, email, password } = req.body;
        
        // Verificar si el usuario o correo ya existen
        const existingUser = await Usuario.findOne({
            $or: [{ nombre }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Usuario o correo electrónico ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = new Usuario({ nombre, email, password: hashedPassword });

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
            .populate('role', 'name') // Popula el campo role y solo trae el campo name
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

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, direccion, telefono, role } = req.body;

        console.log("Datos recibidos para actualizar:", { id, nombre, email, direccion, telefono, role });

        // Validar el rol
        if (role) {
            const roleDocument = await Role.findById(role);
            if (!roleDocument) {
                console.error("El rol especificado no existe:", role);
                return res.status(400).send("El rol especificado no existe.");
            }
            console.log("Rol encontrado:", roleDocument);
        }

        // Preparar datos para la actualización
        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (email !== undefined) updateData.email = email;
        if (direccion !== undefined) updateData.direccion = direccion;
        if (telefono !== undefined) updateData.telefono = telefono;
        if (role !== undefined) updateData.role = role;

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
