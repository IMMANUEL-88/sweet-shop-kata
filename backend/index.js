import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import sweetsRoutes from "./routes/sweetsRoutes.js"

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

export default app;
