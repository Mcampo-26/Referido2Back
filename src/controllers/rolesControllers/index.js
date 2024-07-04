import Role from "../../models/Role.js"; // Asegúrate de tener el modelo Role en la carpeta models

// Controlador para crear un rol
export const createRole = async (req, res) => {
  try {
    const { idRole, name } = req.body; // Desestructura los datos del cuerpo de la solicitud
    const role = new Role({ idRole, name }); // Crea una nueva instancia del modelo de roles
    await role.save(); // Guarda el nuevo rol en la base de datos
    res.status(200).send("Rol creado exitosamente");
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para obtener todos los roles con paginación
export const getRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Desestructura los parámetros de consulta
    const roles = await Role.find()
      .skip((page - 1) * limit) // Salta los documentos anteriores según la página y el límite
      .limit(Number(limit)); // Limita el número de documentos devueltos según el límite

    const total = await Role.countDocuments(); // Cuenta el número total de documentos

    console.log('Roles obtenidos del servidor:', roles);

    res.status(200).json({
      roles,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para obtener todos los roles sin paginación
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para actualizar un rol
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Encuentra el rol por ID y actualiza el nombre
    const roleActualizado = await Role.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!roleActualizado) {
      return res.status(404).send("Rol no encontrado");
    }

    res.status(200).send("Rol actualizado exitosamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para eliminar un rol por ID
export const deleteRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await Role.findByIdAndDelete(id);
    if (!deleteResult) {
      return res.status(404).json({ error: 'No se pudo encontrar el rol con el ID proporcionado' });
    }
    res.status(200).json({ message: 'Rol eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el rol' });
  }
};
