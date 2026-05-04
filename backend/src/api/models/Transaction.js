import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price_eur: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["pending", "completed", "cancelled"], 
        default: "pending" 
    }
}, {
    timestamps: true, 
    collection: "transactions"
});

const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");
export default Transaction;