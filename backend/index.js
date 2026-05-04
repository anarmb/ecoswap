import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./src/config/db.js";
import userRoutes from "./src/api/routes/user.routes.js";
import productRoutes from "./src/api/routes/product.routes.js";
import cors from "cors"
import transactionRoutes from "./src/api/routes/transaction.routes.js"
import categoryRoutes from "./src/api/routes/category.routes.js";


dotenv.config();

connectDB();

const app = express();

//Middlewares
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://ecoswap-ten-kohl.vercel.app"],

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.use((req, res, next) =>{
    return res.status(400).json({message: "Route not found"});
});

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});