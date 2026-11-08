import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// ─── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

// ─── Initialize Express app ──────────────────────────────────────────
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────
// Enable CORS for frontend dev server and production deployments
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BulkMail Backend API',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Start Server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 BulkMail Backend Server running on port ${PORT}`);
});
