import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// --- Route Imports ---
import authRoutes from "./routes/authRoutes.js";
import sweetsRoutes from "./routes/sweetsRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"
import cartRoutes from "./routes/cartRoutes.js"

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // To accept JSON data

app.get("/", (req, res) => {
  res.send("Sweet Shop API is running...");
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);
app.use("/api/cart", cartRoutes);

// --- Error Middleware ---
app.use(errorHandler);

export default app;
