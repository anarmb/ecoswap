import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js"

//Get all transactions or just one
const getAllTransactions = async (req, res, next) => {
    try {
        let query = {};
        const { personal } = req.query;

        if (req.user.role !== "admin" || personal === "true") {
            query = {
                $or: [
                    { buyer_id: req.user._id },
                    { seller_id: req.user._id }
                ]
            };
        }
        const transactions = await Transaction.find(query)
            .populate("product_id", "title price_eur image_url")
            .populate("buyer_id", "name email")
            .populate("seller_id", "name email");

        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(400).json({ message: "Error getting transactions", error: error.message });
    }
};

//Get by ID
const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id)
            .populate("product_id")
            .populate("buyer_id", "name email")
            .populate("seller_id", "name email");

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        const isAdmin = req.user.role === "admin";
        const userId = req.user._id.toString();
        const isBuyer = transaction.buyer_id?._id?.toString() === userId;
        const isSeller = transaction.seller_id?._id?.toString() === userId;

        if (!isAdmin && !isBuyer && !isSeller) {
            return res.status(403).json({ message: "Unauthorized to view this transaction" });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(400).json({ message: "Error getting transaction", error: error.message });
    }
};

//Create transaction when someone buys a product
const createTransaction = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        const buyer_id = req.user._id;

        const product = await Product.findById(product_id);
        
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (!product.available) return res.status(400).json({ message: "Product already sold" });

        if (product.seller_id.toString() === buyer_id.toString()) {
            return res.status(400).json({ message: "You cannot buy your own product" });
        }

        const newTransaction = new Transaction({
            product_id,
            buyer_id,
            seller_id: product.seller_id,
            price_eur: product.price_eur,
            status: "pending"
        });

        const savedTransaction = await newTransaction.save();

        await Product.findByIdAndUpdate(product_id, { available: false });

        return res.status(201).json(savedTransaction);
    } catch (error) {
        return res.status(400).json({ message: "Error creating transaction", error: error.message });
    }
};

//Update transactions status
const updateTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        const isSeller = transaction.seller_id.equals(req.user._id);
        const isBuyer = transaction.buyer_id.equals(req.user._id);
        const isAdmin = req.user.role === "admin";

        if (!isSeller && !isBuyer && !isAdmin) {
            return res.status(403).json({ message: "You don't have permission to modify this product" });
        }

        transaction.status = status;
        await transaction.save();

        if (status === "cancelled") {
            await Product.findByIdAndUpdate(transaction.product_id, { available: true });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(400).json({ message: "Error updating product", error: error.message });
    }
};

//Delete transaction
const deleteTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You don't have permission to delete" });
        }
        
        await Transaction.findByIdAndDelete(id);
        return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
        return res.status(400).json({ message: "Error deleting transaction", error: error.message });
    }
};

export {getAllTransactions, getTransactionById, createTransaction, updateTransactionStatus, deleteTransaction};