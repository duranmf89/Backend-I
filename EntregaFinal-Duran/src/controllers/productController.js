// ESTA OK

import productManager from '../managers/productManager.js';

// CONTROLADOR getProdcts
export const getProducts = async (req, res) => {
    try {
        // extraemos los parametros de consulta de la query (url)
        const { limit = 10, page = 1, sort, query } = req.query;

        //------------------------------------------------------

        // Verificar si existen parámetros no validos en la URL
        const validParams = ['limit', 'page', 'sort', 'query'];      //si no lo incluye, si se escribe cualquier cosa.
        const invalidParams = Object.keys(req.query).filter(param => !validParams.includes(param));

        if (invalidParams.length > 0) {
            console.log(`Parámetros no válidos: ${invalidParams.join(', ')}`);
            return res.status(404).render('404', { title: 'Parámetro inválido' });
        }
        //------------------------------------------------------
        // filtro de busqueda
        const filter = query ? { $or: [
            { category: { $regex: query, $options: 'i' } }, //filtro por categoria. Regex permite coincidencias parciales. la "i" en options hace q sea insensible a mayus y minus
            { status: query === 'true' } // filtro por disponibilidad
        ]} : {};

        //------------------------------------------------------

        // Paginacion 
        const options = {
            limit: parseInt(limit), // cantidad de elementos por pagimna
            page: parseInt(page), // selecciona la pagina
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}, //aca si sort es asc se ordena de manera ascendente, sino es asc se ordena descendetne
            lean: true,
        };

        //------------------------------------------------------

        // Llamamos y obtenemos los productos con el productManager que se comunica con Mongoose (con los parametros de filtro y opciones)
        const products = await productManager.getProducts(filter, options);

        // Verifica si no se encontraron productos con el filter y option aplicado
        if (!products.docs.length) {
            console.log(`No se encontraron productos con el query: "${query}"`);
            return res.status(404).render('404', { title: 'Productos no encontrados' });
        }

        //------------------------------------------------------

        // Enlaces de paginacion
        const prevLink = products.hasPrevPage ? 
            `/views/products?limit=${limit}&page=${products.page - 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        const nextLink = products.hasNextPage ? 
            `/views/products?limit=${limit}&page=${products.page + 1}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;


        //------------------------------------------------------
        
        // Se psasan los datos a la vista index.handlebars
        res.render('index', {
            title: 'Lista de Productos',
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.page - 1 : null,
            nextPage: products.hasNextPage ? products.page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('404', { title: 'Error al obtener productos' });
    }
};


//------------------------------------------------------

// CONTROLADOR para obtener un producto por su ID y mostrar los detalles
export const getProductById = async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).render('404', { title: 'Producto no encontrado' });
        }

        res.render('producto', {
            title: 'Detalle de Producto',
            product,
        });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).render('404', { title: 'Error al obtener producto' });
    }
};

//------------------------------------------------------

// CONTROLADOR de busqueda desde el front y no por query
export const searchProducts = async (req, res) => {
    const { search } = req.query;

    try {
        const products = await productManager.searchProductsByTitle(search);

        res.render('search', {
            title: 'Resultados de Búsqueda',
            products,
            searchQuery: search
        });
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        res.status(500).render('404', { title: 'Error en la búsqueda' });
    }
};


//------------------------------------------------------

// CONTROLADOR para mostrar el formulario de edicion de un producto por ID
export const editProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            res.render('editProduct', { title: 'Edición de Producto', product });
        } else {
            res.status(404).render('404', { title: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al cargar producto para edición:', error);
        res.status(500).render('error', { error: 'Error al cargar producto' });
    }
};

//------------------------------------------------------

// CONTROLADOR para actualizar el producto desde /register (front)
export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updatedData = {
        titulo: req.body.titulo || "",
        descripcion: req.body.descripcion || "",
        codigo: req.body.codigo || "",
        precio: req.body.precio || 0,
        stock: req.body.stock || 0,
        categoria: req.body.categoria || ""
    };

    try {
        const updatedProduct = await productManager.updateProduct(pid, updatedData);
        if (updatedProduct) {
            res.redirect(`/views/products/${pid}`);
        } else {
            res.status(404).render('404', { title: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).render('error', { error: 'Error al actualizar producto' });
    }
};

//------------------------------------------------------

// CONTROLADOR para mostrar productos en tiempo real
export const realTimeProducts = async (req, res) => {
    try {
        const products = await productManager.getProducts({}, { lean: true });
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { error: 'Error al cargar productos' });
    }
};