import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profile_img: {type: String, default: "https://res.cloudinary.com/dkgprzjfa/image/upload/v1762112441/samples/paper.png"},
    role: {type: String, enum: ["admin", "user"], default: "user"}
}, {timestamps: true});

const User = mongoose.model("User", userSchema, "users");
export default User;