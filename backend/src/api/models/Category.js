import mongoose from "mongoose";

const categorySchema = new mongoose.Schema ({
    name:{ type: String, required: true},
    description: { type: String},
    kg_co2_saved: {type: Number, default: 0}
}, {
    timestamps: true,
    collection: "categories"
});

const Category = mongoose.model("Category", categorySchema, "categories");
export default Category;