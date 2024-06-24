import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './src/database/config.js';
import routerUser from './src/routes/index.js';
import morgan from 'morgan';
import cors from 'cors';



// Configurar dotenv para leer el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; // Defino el puerto aquí, con opción a configurar desde .env

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Conectarse a la base de datos
dbConnect()
  .then(() => {
    console.log('Estoy listo y conectado a la base de datos');

    // Iniciar el servidor
    const server = app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
      // Abrir el navegador con la URL del servidor
      //open(`http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al conectar con la base de datos:', error);
  });


app.use('/Usuarios', routerUser);
