import { Router } from "express";
import { isAuth, isAdmin } from "../../middlewares/auth.js";
import { getAllTransactions, getTransactionById, createTransaction, updateTransactionStatus, deleteTransaction } from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.get("/", [isAuth], getAllTransactions);
transactionRoutes.get("/:id", [isAuth], getTransactionById);

transactionRoutes.post("/", [isAuth], createTransaction);

transactionRoutes.patch("/:id", [isAuth], updateTransactionStatus);

//Admin routes
transactionRoutes.delete("/:id", [isAuth, isAdmin], deleteTransaction);

export default transactionRoutes;