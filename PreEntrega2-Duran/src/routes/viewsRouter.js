// viewsRouter.js

import { Router } from 'express';
import productManager from '../managers/productManager.js';

const router = Router();

// Registrar un producto (trae el form de realTimeProducts.handlebars)
router.get('/register', async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.status(200).render('realTimeProducts', { title: 'Registro', products }); 
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Lista todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('index', { 
            title: 'Lista de Productos',  // Titulo para lña pestaña del navegador
            products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});


// Obtener producto por ID con handlebars (frontEnd - render)
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    if (isNaN(pid)) {
        return res.status(400).json({ message: 'El ID del producto debe ser un número válido.' });
    }

    console.log(`Ejecucion solicitud de producto ID: ${pid}`);
    const product = await productManager.getProductById(pid);

    if (product) {
        res.status(201).render('producto', { title: product.title , product });
    } else {
        res.status(404).render('404', { title: 'Error 404'});
        console.log(`Producto ${pid} no encontrado`)
    }
});


// Crear un nuevo producto SOCKET.io
// router.post('/', async (req, res) => {
//     console.log("Ejecución solicitud para crear nuevo producto");
//     const { titulo, descripcion, codigo, precio, stock, categoria } = req.body;
    
//     const errors = [];

//     if (titulo.length < 3) {
//         errors.push('El título debe tener al menos 3 caracteres.');
//     }
//     if (descripcion.length < 10) {
//         errors.push('La descripción debe tener al menos 10 caracteres.');
//     }
//     if (codigo.length >= 40) {
//         errors.push('El código debe contener máximo 40 caracteres');
//     }
//     if (isNaN(precio) || precio <= 0) {
//         errors.push('El precio debe ser un número positivo.');
//     }
//     if (isNaN(stock) || stock < 0) {
//         errors.push('El stock debe ser un número positivo o cero.');
//     }
//     if (!/^[a-zA-Z\s]+$/.test(categoria)) {
//         errors.push('La categoría solo puede contener letras.');
//     }

//     if (errors.length > 0) {
//         console.log("Errores de validación:", errors);
//         return res.status(400).json({ message: 'Errores de validación al crear el producto', errors });
//     }

//     const newProduct = {
//         title: titulo,
//         description: descripcion,
//         code: codigo,
//         price: Number(precio),
//         stock: Number(stock),
//         status: true,
//         category: categoria,
//         thumbnails: [],
//     };

//     await productManager.addProduct(newProduct);

    
//     req.app.get('socketio').emit('productCreated', newProduct);
// });

export default router;
