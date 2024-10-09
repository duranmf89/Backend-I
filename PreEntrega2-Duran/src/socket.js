// SOCKET io

import { validateProductData } from './middlewares/validations.js';
import productManager from './managers/productManager.js';

const initSocket = (io) => {
    io.on('connection', async (client) => {
        console.log('Nuevo cliente conectado');

        // Solicitud de productos al iniciar el navegador
        const products = await productManager.getProducts();
        client.emit('initializeProducts', products);

        //Creacion de producto
        client.on('createProduct', async (productData) => {
            // Middleware de validaciones del form, viene de la carpeta Middlewares
            const errors = validateProductData(productData);
            if (errors.length > 0) {
                client.emit('validationErrors', { errors });
                return;
            }

            try {
                const newProduct = await productManager.addProduct({
                    title: productData.titulo,
                    description: productData.descripcion,
                    code: productData.codigo,
                    price: Number(productData.precio),
                    stock: Number(productData.stock),
                    category: productData.categoria,
                    status: true
                });
                console.log(`Producto creado: Código ${newProduct.code}, ID: ${newProduct.id}`);
                io.emit('productCreated', newProduct);
            } catch (error) {
                console.error('Error al crear producto:', error);
            }
        });

        // Eliminacion de producto
        client.on('deleteProduct', async (productId) => {
            try {
                await productManager.deleteProduct(Number(productId));
                io.emit('productDeleted', productId);
            } catch (error) {
                console.error('Error al eliminar producto:', error);
            }
        });
    });

    return io;
}

export default initSocket;