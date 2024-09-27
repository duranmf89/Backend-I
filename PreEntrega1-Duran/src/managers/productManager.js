import fs from 'fs/promises';

const path = './database/products.json';

class ProductManager {
    constructor() {
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(path);
        } catch (err) {
            if (err.code === 'ENOENT') {
                await fs.writeFile(path, JSON.stringify({products: []}));
            } else {
                throw err;
            }
        }
    }    

    async getProducts() {
        const data = await fs.readFile(path, 'utf-8');
        const { products } = JSON.parse(data);
        return products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === Number(id));
    }

    async addProduct(product) {
        const data = JSON.parse(await fs.readFile(path, 'utf-8'));
        const { products } = data;

        // Encuentra el ID más alto en los productos existentes
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        const newId = maxId + 1;

        const newProduct = { id: newId, ...product };
        products.push(newProduct);
        
        await fs.writeFile(path, JSON.stringify({ products }, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedProduct) {
        const data = JSON.parse(await fs.readFile(path, 'utf-8'));
        const { products } = data;
        const index = products.findIndex(product => product.id === Number(id));
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            await fs.writeFile(path, JSON.stringify({ products }, null, 2));
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        const data = JSON.parse(await fs.readFile(path, 'utf-8'));
        let { products } = data;
        products = products.filter(product => product.id !== Number(id));
        await fs.writeFile(path, JSON.stringify({ products }, null, 2));
        return { message: 'Producto eliminado' };
    }
}

export default new ProductManager();
