import Category from "../models/Category.js";
import Product from "../models/Product.js";

//Get all categories
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(400).json({ message: "Error getting categories", error: error.message });
    }
};

//Admin can create a new category if needed
const createCategory = async (req, res, next) => {
    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        return res.status(201).json(savedCategory);
    } catch (error) {
        return res.status(400).json({ message: "Error creating category", error: error.message });
    }
};

//Admin can update a category
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(400).json({ message: "Error updating category", error: error.message });
    }
};

//Admin can delete categories
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const productsInCategory = await Product.countDocuments({ category_id: id });
        if (productsInCategory > 0) {
            return res.status(400).json({ 
                message: `You cannot delete this category, check products.` 
            });
        }
        await Category.findByIdAndDelete(id);
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Error deleting category", error: error.message });
    }
};

export { getAllCategories, createCategory, updateCategory, deleteCategory };