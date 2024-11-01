// Esta OK

export const validateProductData = (productData) => {
    const errors = [];

    if (productData.titulo.length < 3) {
        errors.push('El título debe tener al menos 3 caracteres.');
    }
    if (productData.descripcion.length < 10) {
        errors.push('La descripción debe tener al menos 10 caracteres.');
    }
    if (productData.descripcion.length > 75) {
        errors.push('La descripción debe tener menos de 75 caracteres.');
    }
    if (productData.codigo.length >= 40) {
        errors.push('El código debe contener máximo 40 caracteres.');
    }
    if (isNaN(productData.precio) || productData.precio <= 0) {
        errors.push('El precio debe ser un número positivo.');
    }
    if (isNaN(productData.stock) || productData.stock < 0) {
        errors.push('El stock debe ser un número positivo o cero.');
    }
    if (!/^[a-zA-Z\s]+$/.test(productData.categoria)) {
        errors.push('La categoría solo puede contener letras.');
    }

    return errors;
};
