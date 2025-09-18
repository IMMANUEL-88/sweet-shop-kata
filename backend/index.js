import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

if (process.env.NODE_ENV !== "test") {
    connectDB();
}

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // To accept JSON data

app.get('/', (req, res) => {
  res.send('Sweet Shop API is running...');
});

// --- API Routes ---
app.use('api/auth', authRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;