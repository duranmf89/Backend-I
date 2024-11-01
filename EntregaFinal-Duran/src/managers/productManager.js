// Esta OK

import Product from '../dao/models/product_model.js';

class productManager {


    // Obtener todos los productos con filtro, paginacion, y ordenamiento
    async getProducts(filter = {}, options = {}) {
        try {
            return await Product.paginate(filter, options);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    // Obtener un producto por ID
    async getProductById(id) {
        try {
            return await Product.findById(id).lean();
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    // Actualizar un producto por ID 
    async updateProduct(id, updatedData) {
        try {
            return await Product.findByIdAndUpdate(id, updatedData, { new: true });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    // Buscar productos por titulo desde front con fuzzy seach
    async searchProductsByTitle(query) {
        return await Product.aggregate([
            {
                $search: {
                    index: "fuzzy_search_index",
                    text: {
                        query: query,
                        path: "title",
                        fuzzy: {
                            maxEdits: 2,
                            prefixLength: 1,
                            maxExpansions: 100
                        }
                    }
                }
            }
        ]);
    }
}


export default new productManager();
