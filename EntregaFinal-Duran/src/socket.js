// Esta OK

// SOCKET io

import { validateProductData } from './middlewares/validations.js';
import Product from './dao/models/product_model.js'; 

const initSocket = (io) => {
    io.on('connection', async (client) => {
        console.log('Nuevo cliente conectado');

        // Creacion de productoque viene desde register(ruta), desde vista realTimeProducts.handlebars
        client.on('createProduct', async (productData) => {
            // Middleware de validaciones del formulario, si se almacenan errores, emite un alert en el front y corta con el return, sino sigue a la creacion en mongoDB
            const errors = validateProductData(productData);
            if (errors.length > 0) {
                client.emit('validationErrors', { errors });
                return;
            }

            try {
                // Nuevo producto (create) en MongoDB con mongoose
                const newProduct = await Product.create({
                    title: productData.titulo,
                    description: productData.descripcion,
                    code: productData.codigo,
                    price: Number(productData.precio),
                    stock: Number(productData.stock),
                    category: productData.categoria,
                    status: true
                });
                
                // verificamos en la consola el producto creado
                console.log(`Producto creado: ${newProduct.title}, _Id: ${newProduct._id}`);
                
                // Envia al handlebars el nuevo producto en tiempo real
                io.emit('productCreated', newProduct);
            } catch (error) {
                console.error('Error al crear producto en la base de datos de MongoDB:', error);
            }
        });

        // Eliminacion de producto en mongoDB con mongoose (findByIdAndDelete). Viene el id de mongo del producto en productId y lo insrtamos como parametro en el async para que lo identifique en mongo y lo borre
        client.on('deleteProduct', async (productId) => {
            try {
                
                await Product.findByIdAndDelete(productId);
                
                console.log(`Producto eliminado: ID ${productId}`);
                
                // Enviamos el id del producto para que se borre en tiempo real
                io.emit('removeDeleted', productId);
            } catch (error) {
                console.error('Error al eliminar producto en MongoDB:', error);
            }
        });

        // Actualizacion de producto en MongoDB
        client.on('updateProduct', async ({ productId, updatedData }) => {
            // Validar los datos del producto actualizado
            const errors = validateProductData(updatedData);
            if (errors.length > 0) {
                client.emit('validationErrors', { errors });
                return;
            }

            try {
                // Actualizar el producto en MongoDB
                const updatedProduct = await Product.findByIdAndUpdate(productId, {
                    title: updatedData.titulo,
                    description: updatedData.descripcion,
                    code: updatedData.codigo,
                    price: Number(updatedData.precio),
                    stock: Number(updatedData.stock),
                    category: updatedData.categoria
                }, { new: true });

                if (updatedProduct) {
                    console.log(`Producto actualizado: ${updatedProduct.title}, _Id: ${updatedProduct._id}`);
                    client.emit('updateSuccess', productId);
                } else {
                    client.emit('validationErrors', { errors: ['Producto no encontrado para actualizar.'] });
                }
            } catch (error) {
                console.error('Error al actualizar producto en MongoDB:', error);
                client.emit('validationErrors', { errors: ['Ocurrio un error al actualizar el producto.'] });
            }
        });
    });

    return io;
};

export default initSocket;
