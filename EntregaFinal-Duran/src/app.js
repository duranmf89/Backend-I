// Esta OK

import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'; // se agrego esto para hacer el populate con handlebars y mostrar los carritos con /carts/:cid
import viewsRouter from './routes/viewsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import config from './config.js';
import initSocket from './socket.js';

// Inicializacion de Express
const app = express();

// Conectamos a MongoDB Atlas/Compass
async function connectDB() {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log(`Conectado a MongoDB en ${config.MONGODB_URI}`);
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
}

// configuracion y helpers de handlebars 
app.engine('handlebars', engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: `${config.DIRNAME}/views/layouts`,
    defaultLayout: 'main',
    helpers: {
        formatCurrency: (value) => {
            return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);
        }
    }
}));

//-------------------------------------------------------------------------

app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

// Middlewares de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(`${config.DIRNAME}/public`));

// Rutas de entrada del proyecto, desde la url es el punto de entrada 
app.use('/views', viewsRouter);
app.use('/carts', cartsRouter);


// Captura de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salio mal en el servidor');
});

// ruta raiz por defecto
app.get('/', (req, res) => {
    res.redirect('/views/products');
});

// Inicia el servidor y y conecta a DB
async function startServer() {
    await connectDB();

    const httpServer = app.listen(config.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${config.PORT}, accede a: http://localhost:${config.PORT}`);
    });

    // Configuracion de socket.io
    const io = new Server(httpServer);
    initSocket(io);
    app.set('socketio', io);
}

// Inicia la aplicación
startServer();
