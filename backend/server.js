import cors from 'cors';
import { config } from 'dotenv';
// server.js
import express from 'express';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import respondentRoutes from './routes/respondentRoutes.js';
import responseRoutes from './routes/responseRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';

config();
connectDB();

const app = express();

// ----- MIDDLEWARE -----
app.use(
  cors({
    origin: ["http://localhost:3000","https://survey-paltform.vercel.app/"],
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
  })
);
app.use(express.json());

// ----- ROUTES -----

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/surveys', responseRoutes);
app.use('/api/v1/respondents', respondentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
  "success": false,
  "message": "Route did not found"
});
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success:false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});