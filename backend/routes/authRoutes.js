import express from 'express';

import {
  getMe,
  login,
  register,
} from '../controllers/authController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me
router.get('/me', authenticateToken, getMe);

export default router;