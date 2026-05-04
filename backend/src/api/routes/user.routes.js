import { Router } from "express";
import { register, login, getAllUsers, getMyProfile, updateProfile, deleteUser, changePassword } from "../controllers/user.controller.js";
import { upload } from "../../config/cloudinary.js";
import { isAuth, isAdmin } from "../../middlewares/auth.js"

const userRoutes = Router();

userRoutes.post("/register", upload.single("profile_img"), register);
userRoutes.post("/login", login);

userRoutes.get("/me", [isAuth], getMyProfile);

userRoutes.patch("/update", [isAuth], upload.single("profile_img"), updateProfile);
userRoutes.patch("/change-password", [isAuth], changePassword);

userRoutes.delete("/:id", [isAuth], deleteUser);

//Admin routes
userRoutes.get("/", [isAuth, isAdmin], getAllUsers);

export default userRoutes;