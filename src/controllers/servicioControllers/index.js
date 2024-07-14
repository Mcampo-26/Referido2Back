import Servicio from "../../models/Servicio.js"; 

// Controlador para crear un servicio
export const createServicio = async (req, res) => {
  try {
    const { name, empresaId } = req.body; 
    const servicio = new Servicio({ name, empresaId }); 
    await servicio.save(); 
    res.status(200).send("Servicio creado exitosamente");
  } catch (error) {
    res.status(400).send(error.message); 
  }
};

// Controlador para obtener todos los servicios con paginación
export const getServicios = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const servicios = await Servicio.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Servicio.countDocuments(); 

    res.status(200).json({
      servicios,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(400).send(error.message); 
  }
};

// Controlador para obtener todos los servicios sin paginación
export const getAllServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.status(200).json(servicios);
  } catch (error) {
    res.status(400).send(error.message); 
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

// Controlador para obtener servicios por empresa
export const getServiciosByEmpresaId = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const servicios = await Servicio.find({ empresaId });
    res.status(200).json(servicios);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

