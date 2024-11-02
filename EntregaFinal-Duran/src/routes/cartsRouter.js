// Esta OK

import { Router } from 'express';
import {
    createCart,
    addProductToCart,
    getCartById,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProductsFromCart
} from '../controllers/cartController.js';
import { validateCartUpdate } from '../middlewares/validateCartUpdate.js';

const router = Router();

// Rutas de carritos

// Crea carritos a traves de postmaan (POST)
router.post('/', createCart);

// Muestra los productos que existen en un carrito determinadio (:cid) (handlebars) (populate)
router.get('/:cid', getCartById);

// Agrega productos en un carrito determinado (:cid) con un json (postman) con el id del producto que esta en mongoDB
router.post('/:cid/products', addProductToCart);

// Actualiza los productos de un carrito completo (hay validaciones de stock), se pone middleware para validar que se actualiza con datos
// coherentes aunque tambien estemos forzaando a traves del modelo de carts que solo envie product y quantity.
router.put('/:cid', validateCartUpdate, updateCart);

// Actualiza la cantidad de un producto en un carrito determinado (:cid) de un producto determinado (:pid) (hay validaciones de stock)
router.put('/:cid/products/:pid', updateProductQuantity);

// elimina un producto determinado (:pid) de un carrito determinado (:cid)
router.delete('/:cid/products/:pid', deleteProductFromCart);

// elimina todos los productos de un carrito determinado (:cid)
router.delete('/:cid', deleteAllProductsFromCart);

export default router;
