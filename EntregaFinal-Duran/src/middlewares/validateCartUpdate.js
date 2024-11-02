// Esta OK

export const validateCartUpdate = (req, res, next) => {
    const { products } = req.body;

    // Verifica que el campo products sea un array
    if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'El campo "products" debe ser un array.' });
    }

    // Valida cada item del array
    for (const item of products) {
        // Verifica que solo existan los campos "product" y "quantity"
        const keys = Object.keys(item);
        if (!keys.includes('product') || !keys.includes('quantity') || keys.length !== 2) {
            return res.status(400).json({ message: 'Cada item debe contener solo "product" y "quantity".' });
        }

        // verifica de que los campos tengan el tipo adecuado
        if (typeof item.product !== 'string' || typeof item.quantity !== 'number') {
            return res.status(400).json({ message: 'El campo "product" debe ser un string y "quantity" un número.' });
        }

        // verificaque la cantidad no sea negativa
        if (item.quantity < 0) {
            return res.status(400).json({ message: 'La cantidad de "quantity" debe ser mayor o igual a 0.' });
        }
    }

    next();
};

