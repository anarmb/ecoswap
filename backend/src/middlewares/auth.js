import jwt from "jsonwebtoken";
import User from "../api/models/User.js";

const isAuth = async (req, res, next) => { 
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(403).json({message: "Access denied"})
    }
};

export {isAuth, isAdmin}; 
