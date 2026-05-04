import { Router } from "express";
import { isAuth } from "../../middlewares/auth.js";
import {upload} from "../../config/cloudinary.js";
import { getAllProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/user/me", [isAuth], getMyProducts);
productRoutes.get("/:id", getProductById);

productRoutes.post("/", [isAuth], upload.single("image_url"), createProduct);

productRoutes.patch("/:id", [isAuth], upload.single("image_url"), updateProduct);

productRoutes.delete("/:id", [isAuth], deleteProduct);

export default productRoutes;
