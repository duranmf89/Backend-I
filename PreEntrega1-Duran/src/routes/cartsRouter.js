import { Router } from 'express';
import cartManager from '../managers/cartManager.js';

const router = Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    console.log(`Se creo el carrito con ID: ${newCart.id}`)
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito' });
    console.log('Error al crear el carrito')
  }
});

// Obtener todos los carritos
router.get('/carts', async (req, res) => {
  console.log("Ejecucion solicitud para obtener todos los carritos");
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar carritos' });
    console.log('Error al buscar carritos')
  }
})

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
  console.log("Ejecucion solicitud para Obtener productos de un carrito");
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(Number(req.params.cid));
    if (cart) {
      console.log(`Ejecucion exitosa de solicitud para Obtener productos del carrito id: ${ cid }`)
      res.status(200).json(cart.products);
    } else {
      console.log(`Carrito id: ${cid} no encontrado`)
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito' });
    console.log(`Error al obtener el carrito ${cid}`)
  }
});

// Agregar producto a un carrito (por parametro, id del carrito e ID del producto, solo en el body la cantidad)
router.post('/:cid/product/:pid', async (req, res) => {
  console.log("Ejecucion solicitud para Agregar producto a un carrito");
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ message: 'Cantidad es requerida' });
  }

  try {
    const updatedCart = await cartManager.addProductToCart(Number(cid), Number(pid), Number(quantity));  // Asegúrate de pasar los parámetros correctamente
    if (updatedCart) {
      res.status(201).json(updatedCart);
    } else {
      res.status(404).json({ message: `Carrito ${cid} no encontrado` });
      console.log(`Carrito ${cid} no encontrado`)
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito' });
  }
});

// Eliminar carrito
router.delete('/delete/:cid', async (req, res) => {
  const { cid } = req.params;
  console.log(`Ejecución solicitud para eliminar carrito: ${cid}`);

  try {
    const result = await cartManager.deleteCart(req.params.cid);
    console.log(`Se elimino exitosamente el carrito con id: ${cid}`);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).json({ message: 'Error al eliminar el carrito', error: error.message });
  }
});

export default router;