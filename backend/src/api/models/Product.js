import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    price_eur: {type: Number, required: true},
    condition: {type: String, required: true, enum: ["nuevo", "como nuevo", "bueno", "aceptable"]},
    kg_co2_saved: {type: Number, default: 0},
    image_url: {type: String, required: true},
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, 
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    available: { type: Boolean, default:true }
}, { 
    timestamps: true, 
    collection: "products"
});

const Product = mongoose.model("Product", productSchema, "products");
export default Product;