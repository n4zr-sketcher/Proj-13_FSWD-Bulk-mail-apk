import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register — Create a new admin user
router.post('/register', register);

// POST /api/auth/login — Authenticate and get JWT
router.post('/login', login);

// GET /api/auth/profile — Get logged-in user's profile (protected)
router.get('/profile', protect, getProfile);

export default router;
