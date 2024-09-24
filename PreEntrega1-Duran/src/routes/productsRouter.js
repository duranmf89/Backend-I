import { Router } from 'express';
import productManager from '../managers/productManager.js';

const router = Router();


// Lista todos los productos
router.get('/', async (req, res) => {
    console.log("Ejecucion solicitud: mostrar el listado de productos");
    const products = await productManager.getProducts();
    res.json(products);
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params; // Extrae el pid desde los parámetros
    console.log(`Ejecucion solicitud de producto ID: ${pid}`);
    const product = await productManager.getProductById(pid);

    if (product) {
        res.json(product);
    } else {
        // Si no se encuentra el producto, devolver un error 404 con un mensaje
        res.status(404).json({ message: `Producto ${pid} no encontrado` });
        console.log(`Producto ${pid} no encontrado`)
    }
});


// Crear un nuevo producto
router.post('/', async (req, res) => {
    console.log("Ejecucion solicitud para crear nuevo producto");
    const newProduct = req.body;
    const createdProduct = await productManager.addProduct(newProduct);
    res.status(201).json(createdProduct);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params; // Extrae el pid desde los parámetros
    console.log(`Ejecucion solicitud para actualizar producto: ${pid}`);
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params; // Extrae el pid desde los parámetros
    console.log(`Ejecucion solicitud para eliminar producto: ${pid}`);
    const result = await productManager.deleteProduct(req.params.pid);
    res.json(result);
});

export default router;
