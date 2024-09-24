import fs from 'fs/promises';

const path = './carts.json';

class CartManager {
    constructor() {
        // Inicializa el archivo si no existe
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(path);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Crea el archivo con un array vacío si no existe
                await fs.writeFile(path, JSON.stringify([]));
            } else {
                throw err;
            }
        }
    }

    async getCarts() {
        const data = await fs.readFile(path, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async addCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);

        if (cart) {
            const productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;  // Sumar la cantidad
            } else {
                cart.products.push({ product: productId, quantity });  // Agregar nuevo producto con la cantidad
            }
            await fs.writeFile(path, JSON.stringify(carts, null, 2));
            return cart;
        }
        return null;
    }

    async getProductsFromCart(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        return cart ? cart.products : null;
    }

    async deleteCart(cartId) {
        try {
            
            const data = JSON.parse(await fs.readFile(path, 'utf-8'));
            const updatedCarts = data.filter(cart => cart.id !== Number(cartId));

            await fs.writeFile(path, JSON.stringify(updatedCarts, null, 2));

            return { message: 'Carrito eliminado' };
        }
        catch (error) {
            console.error('Error en deleteCart:', error);
            throw error;
        }
    }

}

export default new CartManager();
