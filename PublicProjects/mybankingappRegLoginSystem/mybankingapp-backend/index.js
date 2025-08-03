import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// For cookies
app.use(cookieParser());

// Basic security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Custom NoSQL Injection Sanitizer (no express-mango-sanitize because it's not compatible with ES Modules) [only a backup option as Joi validation is taking out invalid emails anyway]
app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (/^\$/.test(key)) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
});


// CORS config – change this to your frontend URL later!!!
app.use(cors({
  origin: 'https://mybankingapp-regandlogin-frontend.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from mybankingapp backend!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
