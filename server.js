import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRouter from './src/routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose.set('strictQuery', true);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRouter);

app.get('/', (_req, res) => res.json({ ok: true, service: 'paribas-backend' }));

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
