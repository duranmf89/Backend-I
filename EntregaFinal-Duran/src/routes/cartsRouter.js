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

const router = Router();

// Rutas de carritos
router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/products', addProductToCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.delete('/:cid', deleteAllProductsFromCart);

export default router;
