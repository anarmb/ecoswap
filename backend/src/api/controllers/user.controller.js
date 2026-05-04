import User from "../models/User.js";
import bcrypt from "bcrypt";
import {generateToken} from "../../utils/jwt.js";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js"

//Create a new account
const register = async (req, res, next) =>{
    try {
        const newUser = new User(req.body);
        const userExists = await User.findOne({ email: newUser.email });

        if (userExists) {
            return res.status(400).json({message: "Email already registered"});
        }

        newUser.password = bcrypt.hashSync(newUser.password, 10);

        if (req.file) {
            newUser.profile_img = req.file.path;
        }
        const userDB = await newUser.save();

        const token = generateToken(userDB._id);
        
        return res.status(201).json({ message: "User created", user: userDB });

    } catch (error) {
        return res.status(500).json({ message: "Error creating new user", error });
    }
};

//Access with your account 
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({ message: "User not found" });
        }

        if (bcrypt.compareSync(password, userDB.password)) {
            const token = generateToken(userDB._id);
            return res.status(200).json({user: userDB, token});
        }

        return res.status(400).json({ message: "Incorrect password" });

    } catch (error) {
        return res.status(500).json({ message: "Login error", error });
    }
};

//Admin can view all users registered
const getAllUsers = async (req, res, next) => { 
    try{ 
        const users = await User.find().select("-password");
        return res.status(200).json(users);
    } catch (error) { 
        return res.status(400).json({ message: "Error getting users", error: error.message});
    }
};

//User can see the profile
const getMyProfile = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json(user);
    } catch (error) { 
        return res.status(400).json({message: "Error getting profile", error: error.message});
    }
};

//User updates the profile
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updateData = { ...req.body };

        if (req.file && req.file.path) {
            updateData.profile_img = req.file.path;
        } else {
            delete updateData.profile_img;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({ message: "Error updating profile", error: error.message });
    }
};

//password change
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "La contraseña actual no es correcta" });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        return res.status(400).json({ message: "Error al cambiar la contraseña", error: error.message });
    }
};

//Delete accounts
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        const isSelfDelete = req.user._id.toString() === id;
        const isAdminUser = req.user.role === "admin";

        if (!isSelfDelete && !isAdminUser) {
            return res.status(403).json({ message: "You don't have permission for this" });
        }

        const DEFAULT_IMG = "https://res.cloudinary.com/dkgprzjfa/image/upload/v1762112441/samples/paper.png";
        if (userToDelete.profile_img && userToDelete.profile_img !== DEFAULT_IMG) {
            const fileName = userToDelete.profile_img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`ecoswap_uploads/${fileName}`);
        }

        const products = await Product.find({ seller_id: id });

        for (const product of products) {
            if (product.image_url) {
                const pFileName = product.image_url.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`ecoswap_uploads/${pFileName}`);
            }
        }

        await Product.deleteMany({ seller_id: id });
        await User.findByIdAndDelete(id);

        return res.status(200).json({ 
            message: "Account and products deleted" 
        });

    } catch (error) {
        return res.status(400).json({ 
            message: "Error deleting the user", error: error.message
        });
    }
};

export { register, login, getAllUsers, getMyProfile, updateProfile, deleteUser, changePassword };