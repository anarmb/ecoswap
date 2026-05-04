import Product from "../models/Product.js"
import Category from "../models/Category.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

//Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const { title, category, minPrice, maxPrice } = req.query;
        let query = { available: true };

        if (title) {
            query.title = { $regex: title, $options: "i" };
        }
        if (category) {
            query.category_id = category;
        }
        if (minPrice || maxPrice) {
            query.price_eur = {};
            if (minPrice) query.price_eur.$gte = Number(minPrice);
            if (maxPrice) query.price_eur.$lte = Number(maxPrice);
        }

        const products = await Product.find(query)
            .populate("category_id", "name kg_co2_saved")
            .populate("seller_id", "name email profile_img");
            
        return res.status(200).json(products);
    } catch (error) {
        return res.status(400).json({ message: "Error getting products", error: error.message });
    }
};

//Get a product
const getProductById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id)
            .populate("seller_id", "name email profile_img")
            .populate("category_id", "name kg_co2_saved");
        
            if (!product) return res.status(404).json({message: "Product not found"}); 

            return res.status(200).json(product);
    } catch (error) { 
        return res.status(400).json({message: "Error getting the product", error});
    }
};

//Get just my products
    const getMyProducts = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const myProducts = await Product.find({ seller_id: userId })
            .populate("category_id", "name kg_co2_saved");

        return res.status(200).json(myProducts);
    } catch (error) {
        return res.status(400).json({ 
            message: "Error getting your products", 
            error: error.message 
        });
    }
};    

//Create a new product to sell 
const createProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        if (req.file) {
            newProduct.image_url = req.file.path;
        }
        newProduct.seller_id = req.user._id;

        const productDB = await newProduct.save();
        return res.status(201).json(productDB);
    } catch (error) {
        return res.status(400).json({message: "Error creating product", error});
    }
};

// Update product details
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productExist = await Product.findById(id);

        if (!productExist) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!productExist.available) {
            return res.status(403).json({ message: "No se puede modificar un producto que ya está reservado o vendido." });
        }

        const productData = { ...req.body };

        if (req.file) {
            if (productExist.image_url) {
                const fileName = productExist.image_url.split("/").pop().split(".");
                const publicId = `ecoswap_uploads/${fileName}`;
                await cloudinary.uploader.destroy(publicId);
            }
            productData.image_url = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(400).json({ message: "Error updating product", error: error.message });
    }
};

//Delete product
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.available) {
            return res.status(403).json({ message: "No se puede eliminar un producto que ya forma parte de una transacción." });
        }

        const isOwner = product.seller_id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "You don't have permission to delete this product" });
        }

        if (product.image_url) {
            const fileName = product.image_url.split("/").pop().split(".");
            const publicId = `ecoswap_uploads/${fileName}`;
            await cloudinary.uploader.destroy(publicId);
        }

        await Product.findByIdAndDelete(id);
        
        return res.status(200).json({ 
            message: isAdmin ? "Product deleted by Admin" : "Product deleted successfully" 
        });
    } catch (error) {
        return res.status(400).json({ message: "Error deleting product", error: error.message });
    }
};

export {
    getAllProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct }