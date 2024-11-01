// Esta OK

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Definicion del esquema de productos
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true }, 
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
});

// Plugin de paginacion
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
