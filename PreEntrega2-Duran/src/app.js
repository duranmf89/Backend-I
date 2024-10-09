// app.js

import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import config from './config.js';
import { Server } from 'socket.io';
import initSocket from './socket.js'; 

const app = express();

// Iniciar el servidor HTTP
const httpServer = app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.PORT}, accede a: http://localhost:${config.PORT}`);
});


const io = new Server(httpServer);
initSocket(io);

app.set('socketio', io);

// Helper de handlebars para formato de precio
Handlebars.registerHelper('formatCurrency', function (value) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);
});

// Configuración de motor de plantillas Handlebars
app.engine('handlebars', engine({
    layoutsDir: `${config.DIRNAME}/views/layouts`,
    defaultLayout: 'main',
    helpers: {
        isArray: function (value) {
            return Array.isArray(value);
        }
    }
}));

app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta estandar
app.get('/', (req, res) => {
    console.log('Ruta principal accedida');
    res.redirect('/api/views');
});

// Rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/views', viewsRouter);

// Captura de errores grales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});


app.use('/static', express.static(`${config.DIRNAME}/public`));
