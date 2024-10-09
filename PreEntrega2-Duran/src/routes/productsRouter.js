import { Router } from 'express';
import productManager from '../managers/productManager.js';

const router = Router();


// Lista todos los productos en json
router.get('/', async (req, res) => {
    console.log("Ejecucion solicitud: mostrar el listado de productos");
    const products = await productManager.getProducts();
    res.json(products);
});


// Obtener producto por ID por postman
router.get('/:pid', async (req, res) => {
    const { pid } = req.params; 

    
    if (isNaN(pid)) {
        return res.status(400).json({ message: 'El ID del producto debe ser un número válido.' });
    }

    console.log(`Ejecucion solicitud de producto ID: ${pid}`);
    const product = await productManager.getProductById(pid);

    if (product) {
        res.json(product);
    } else {

        res.status(404).json({ message: `Producto ${pid} no encontrado` });
        console.log(`Producto ${pid} no encontrado`)
    }
});

// Crear un nuevo producto desde json (Postman)
router.post('/register', async (req, res) => {
    console.log("Ejecucion solicitud para crear nuevo producto");
    const newProduct = req.body;
    const createdProduct = await productManager.addProduct(newProduct);
    res.status(201).json(createdProduct);
});


// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params; 
    console.log(`Ejecucion solicitud para actualizar producto: ${pid}`);
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    console.log(`Ejecucion solicitud para eliminar producto: ${pid}`);
    const result = await productManager.deleteProduct(req.params.pid);
    res.json(result);
});

export default router;
