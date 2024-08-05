import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.id, role: decoded.role }; // Agrega los datos del usuario al request
        next(); // Continúa con la siguiente función del middleware o controlador
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
