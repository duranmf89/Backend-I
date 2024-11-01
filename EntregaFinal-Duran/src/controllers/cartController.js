// Esta OK

import Cart from '../dao/models/cart_model.js';
import Product from '../dao/models/product_model.js'; 


// Crear un nuevo carrito
// Metodo POST
// http://localhost:8080/carts
export const createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json({ message: 'Carrito creado', cart: newCart });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito', error });
    }
};

// Agregar un producto al carrito
// Metodo POST
//http://localhost:8080/carts/"_id_cart"/products
// body: { "productId": "_id_producto", "quantity": 1 }
export const addProductToCart = async (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        // Verificamos si la cantidad solcitada supera el stock disponible (primera vez que se carga el producto)
        if (quantity > product.stock) {
            return res.status(400).json({ message: 'No hay suficiente stock disponible' });
        }

        // Buscar si el producto ya esta en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            // Si el producto ya esta en el carrito actualizamos la cantidad
            cart.products[productIndex].quantity += quantity;

            // Verifica nuevamente si la cantidad en el carrito supera el stock con la nueva cantidad agregada (es por si el producto ya existe en el carrito)
            if (cart.products[productIndex].quantity > product.stock) {
                return res.status(400).json({ message: 'No hay suficiente stock disponible' });
            }
        } else {
            // Si el producto no ests, lo agrega
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
};


// Obtener un carrito con productos completos (populate)
// Metodo GET
//http://localhost:8080/carts/"_id_cart"
// Obtener un carrito con productos completos (populate) y renderizar en la vista carrito.handlebars
export const getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');

        if (!cart) return res.status(404).render('404', { title: 'Carrito no encontrado' });

        res.render('carrito', {
            title: 'Detalle del Carrito',
            products: cart.products 
        });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).render('404', { title: 'Error al obtener carrito' });
    }
};


// Eliminar un producto del carrito
// Metodo DELETE
// http://localhost:8080/carts/"cart_id"/products/"product_id"
export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        await cart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito'});
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
    }
};

// Actualizar un carrito con un arreglo de productos
// Metodo PUT
// http://localhost:8080/carts/"_id_carrito"
// en postman el body:
//{
//     "products": [
//         {
//             "product": "_id_producto",
//             "quantity": 3
//         },
//         {
//             "product": "_id_producto",
//             "quantity": 1
//         }
//     ]
// }
export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        // Verifica el stock de cada producto
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Producto con ID ${item.product} no encontrado` });

            if (item.quantity > product.stock) {
                return res.status(400).json({ message: `No hay suficiente stock para el producto con ID ${item.product}` });
            }
        }

        // Se renueva el carrito
        cart.products = products;

        await cart.save();
        res.status(200).json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error });
    }
};


// Actualizar solo la cantidad de un producto
// Metodo PUT
// http://localhost:8080/carts/"_id_carrito"/products/"_id_producto"
// en postman el body: { "quantity": 2 }
export const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        if (quantity > product.stock) {
            return res.status(400).json({ message: 'No hay suficiente stock disponible' });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();
        res.status(200).json({ message: 'Cantidad de producto actualizada', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error });
    }
};


// Vaciar un carrito
// Metodo DELETE
// http://localhost:8080/carts/"_id_carrito"
export const deleteAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid);

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });


        cart.products = [];

        await cart.save();
        res.status(200).json({ message: 'Carrito vacío', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};
