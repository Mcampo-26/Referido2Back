import Usuario from '../../models/Usuario.js';
import bcrypt from 'bcryptjs';

export const loginUsuario = async (req, res) => {
    console.log("Datos recibidos:", req.body);
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });
     
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

export const logoutUsuario = async (req, res) => {
    try {
        res.clearCookie('tu_cookie_de_sesion');
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al cerrar la sesión' });
    }
};

export const createUsuario = async (req, res) => {
    try {
        const { nombre, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = new Usuario({ nombre, email, password: hashedPassword});
        await usuario.save();
        res.status(201).json({ message: "Usuario creado exitosamente", usuario });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const usuarios = await Usuario.find()
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
        const { nombre, email, password, direccion, telefono, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { nombre, email, password: hashedPassword, direccion, telefono, role },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.status(200).json({ message: "Usuario actualizado exitosamente", usuario: usuarioActualizado });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

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

export const addToFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.favorites.push(productId);
        await usuario.save();

        res.status(200).json({ message: 'Producto agregado a favoritos correctamente', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al agregar el producto a favoritos' });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.favorites = usuario.favorites.filter(favoriteId => favoriteId !== productId);
        await usuario.save();

        res.status(200).json({ message: 'Producto eliminado de favoritos correctamente', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al eliminar el producto de favoritos' });
    }
};
