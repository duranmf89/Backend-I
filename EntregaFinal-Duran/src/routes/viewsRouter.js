// Esta OK


import { Router } from 'express';
import {
    getProducts,
    getProductById,
    searchProducts,
    editProduct,
    updateProduct,
    realTimeProducts
} from '../controllers/productController.js';

const router = Router();

// Rutas para la gestion de productos

// Ruta para mostrar todos los productos paginados en la vista principal
router.get('/products', getProducts);

// Ruta para buscar productos (front)
router.get('/products/search', searchProducts);

// Ruta para mostrar un producto individual por su ID
router.get('/products/:pid', getProductById);

// Ruta para mostrar el formulario de edicion de un producto por su ID
router.get('/products/:pid/edit', editProduct);

// Ruta para manejar la actualizacion del producto
router.post('/products/:pid', updateProduct);

// Ruta para mostrar la vista de productos en tiempo real
router.get('/register', realTimeProducts);

export default router;
