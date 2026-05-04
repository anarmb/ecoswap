import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import iconv from "iconv-lite";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "../config/db.js";
import bcrypt from "bcrypt";

import User from "../api/models/User.js";
import Category from "../api/models/Category.js";
import Product from "../api/models/Product.js";
import Transaction from "../api/models/Transaction.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Clean Cloudinary folder
const cleanCloudinary = async () => {
    try {
        const result = await cloudinary.api.delete_resources_by_prefix("ecoswap_uploads/");
        console.log(`Cloudinary cleaned: ${Object.keys(result.deleted).length} images deleted`);
    } catch (error) {
        console.error("Error cleaning Cloudinary:", error.message);
    }
};

//CSV reading
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(iconv.decodeStream("win1252"))
            .pipe(csv({ separator: ";" }))
            .on("data", (data) => {
                const cleanedData = {};
                Object.keys(data).forEach((key) => {
                    cleanedData[key.trim()] = data[key];
                });
                results.push(cleanedData);
            })
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};

//Clean and insert data
const seedDatabase = async () => {
  try {
    await connectDB();
    await cleanCloudinary();

    //Cleaning database
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Transaction.deleteMany();
    console.log("DB cleaned");

    //Find paths
    const categoriesPath = path.resolve("src", "data", "categories.csv");
    const usersPath = path.resolve("src", "data", "users.csv");
    const productsPath = path.resolve("src", "data", "products.csv");
    const transactionsPath = path.resolve("src", "data", "transactions.csv");

    //Insert categories
    const categoriesData = await readCSV(categoriesPath);

    const insertedCategories = await Category.insertMany(
      categoriesData.map(c => ({
        name: c.name?.trim(),
        description: c.description?.trim(),
        kg_co2_saved: Number(c.kg_co2_saved) || 0
      }))
    );

    const categoryMap = {};
    categoriesData.forEach((c, index) => {
        const oldId = c.category_id?.trim();
        categoryMap[oldId] = insertedCategories[index]._id;
    });
    console.log("Categories inserted");

    //Insert users
    const usersData = await readCSV(usersPath);

    const usersToInsert = usersData.map((u) => ({
        name: u.name?.trim(),
        email: u.email?.trim(),
        password: bcrypt.hashSync("password123", 10),
        profile_img: "https://res.cloudinary.com/dkgprzjfa/image/upload/v1762112441/samples/paper.png",
        role: u.role || "user"
    }));

    const insertedUsers = await User.insertMany(usersToInsert);

    const userMap = {};
    usersData.forEach((u, index) => {
        const oldId = u.user_id?.trim();
        userMap[oldId] = insertedUsers[index]._id;
    });
    console.log("Users inserted");

    //Insert products
    const productsData = await readCSV(productsPath);

    const productsToInsert = productsData.map((p) => ({
        title: p.title?.trim(),
        description: p.description?.trim(),
        price_eur: parseFloat(String(p.price_eur).replace(",", ".")) || 0,
        condition: p.condition ? p.condition.toLowerCase().trim() : "bueno",
        kg_co2_saved: parseFloat(String(p.kg_co2_saved).replace(",", ".")) || 0,
        image_url: p.image_url?.trim(),
        category_id: categoryMap[p.category_id?.trim()] || null,
        seller_id: userMap[p.seller_id?.trim()] || null,
        available: String(p.available).toLowerCase().trim() === "true"
    }));

    const insertedProducts = await Product.insertMany(productsToInsert);

    const productMap = {};
    productsData.forEach((p, index) => {
        const oldId = p.product_id?.trim();
        productMap[oldId] = insertedProducts[index]._id;
    });
    console.log("Products inserted");

    //Insert transactions
    const transactionsData = await readCSV(transactionsPath);

    const transactionsToInsert = transactionsData.map((t) => ({
        buyer_id: userMap[t.buyer_id?.trim()] || null,
        seller_id: userMap[t.seller_id?.trim()] || null,
        product_id: productMap[t.product_id?.trim()] || null,
        price_eur: parseFloat(String(t.price_eur).replace(",", ".")) || 0,
        status: t.status ? t.status.toLowerCase().trim() : "pending"
    }));

    await Transaction.insertMany(transactionsToInsert);

    console.log("Transactions inserted");

    console.log("Seeding completed");
    mongoose.disconnect();

  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();