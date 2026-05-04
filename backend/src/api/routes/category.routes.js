import { Router } from "express";
import { isAuth, isAdmin } from "../../middlewares/auth.js";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategories);

//Admin routes
categoryRoutes.post("/", [isAuth, isAdmin], createCategory);

categoryRoutes.patch("/:id", [isAuth, isAdmin], updateCategory);

categoryRoutes.delete("/:id", [isAuth, isAdmin], deleteCategory);

export default categoryRoutes;