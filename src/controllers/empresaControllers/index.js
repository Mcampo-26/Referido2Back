import Empresa from "../../models/Empresa.js";

// Controlador para crear una empresa
export const createEmpresa = async (req, res) => {
  try {
    const { name } = req.body;
    const empresa = new Empresa({ name });
    await empresa.save();
    res.status(200).send("Empresa creada exitosamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para obtener todas las empresas con paginación
export const getEmpresas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const empresas = await Empresa.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Empresa.countDocuments();

    res.status(200).json({
      empresas,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para obtener todas las empresas sin paginación
export const getAllEmpresas = async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.status(200).json(empresas);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para obtener una empresa por ID
export const getEmpresaById = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    if (!empresa) {
      return res.status(404).send("Empresa no encontrada");
    }
    res.status(200).json(empresa);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Controlador para actualizar una empresa
export const updateEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

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
    res.status(500).json({ error: 'Ocurrió un error al eliminar la empresa' });
  }
};
