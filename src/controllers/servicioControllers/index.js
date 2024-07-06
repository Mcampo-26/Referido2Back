import Servicio from "../../models/Servicio.js"; // Asegúrate de tener el modelo Servicio en la carpeta models

// Controlador para crear un servicio
export const createServicio = async (req, res) => {
  try {
    const { name } = req.body; // Desestructura los datos del cuerpo de la solicitud
    const servicio = new Servicio({ name }); // Crea una nueva instancia del modelo de servicios
    await servicio.save(); // Guarda el nuevo servicio en la base de datos
    res.status(200).send("Servicio creado exitosamente");
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para obtener todos los servicios con paginación
export const getServicios = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Desestructura los parámetros de consulta
    const servicios = await Servicio.find()
      .skip((page - 1) * limit) // Salta los documentos anteriores según la página y el límite
      .limit(Number(limit)); // Limita el número de documentos devueltos según el límite

    const total = await Servicio.countDocuments(); // Cuenta el número total de documentos

    res.status(200).json({
      servicios,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para obtener todos los servicios sin paginación
export const getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.status(200).json(servicios);
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para actualizar un servicio
export const updateServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Encuentra el servicio por ID y actualiza el nombre
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).send("Servicio no encontrado");
    }

    res.status(200).send("Servicio actualizado exitosamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para eliminar un servicio por ID
export const deleteServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await Servicio.findByIdAndDelete(id);
    if (!deleteResult) {
      return res.status(404).json({ error: 'No se pudo encontrar el servicio con el ID proporcionado' });
    }
    res.status(200).json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al eliminar el servicio' });
  }
};
