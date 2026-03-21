import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import errorHandler from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
// import adminRoutes from "./src/routes/adminRoutes.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.json({ message: "Kapiva Backend Running ✅" }));

app.use(errorHandler);

export default app;