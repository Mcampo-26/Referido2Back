import Empresa from "../../models/Empresa.js"; // Asegúrate de tener el modelo Empresa en la carpeta models

// Controlador para crear una empresa
export const createEmpresa = async (req, res) => {
  try {
    const { idEmpresa, name } = req.body; // Desestructura los datos del cuerpo de la solicitud
    const empresa = new Empresa({ idEmpresa, name }); // Crea una nueva instancia del modelo de empresas
    await empresa.save(); // Guarda la nueva empresa en la base de datos
    res.status(200).send("Empresa creada exitosamente");
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para obtener todas las empresas con paginación
export const getEmpresas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Desestructura los parámetros de consulta
    const empresas = await Empresa.find()
      .skip((page - 1) * limit) // Salta los documentos anteriores según la página y el límite
      .limit(Number(limit)); // Limita el número de documentos devueltos según el límite

    const total = await Empresa.countDocuments(); // Cuenta el número total de documentos

        res.status(200).json({
      empresas,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para obtener todas las empresas sin paginación
export const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(400).send(error.message); // Maneja los errores
  }
};

// Controlador para actualizar una empresa
export const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Encuentra la empresa por ID y actualiza el nombre
    const empresaActualizada = await Empresa.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!empresaActualizada) {
      return res.status(404).send("Empresa no encontrada");
    }

    res.status(200).send("Empresa actualizada exitosamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para eliminar una empresa por ID
export const deleteEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await Empresa.findByIdAndDelete(id);
    if (!deleteResult) {
      return res.status(404).json({ error: 'No se pudo encontrar la empresa con el ID proporcionado' });
    }
    res.status(200).json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar la empresa' });
  }
};
