import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Helper: Generate JWT ────────────────────────────────────────────
/**
 * Create a signed JWT containing the user's ID.
 * Token expires in 30 days.
 * @param {string} id - MongoDB user ID
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─── POST /api/auth/register ─────────────────────────────────────────
/**
 * Register a new admin user.
 * Body: { name, email, password }
 * Returns the created user (without password) and a JWT.
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create the user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    console.log(`✅ New user registered: ${user.email}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─── POST /api/auth/login ────────────────────────────────────────────
/**
 * Authenticate an existing user.
 * Body: { email, password }
 * Returns user data and a JWT on success.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ─── GET /api/auth/profile ───────────────────────────────────────────
/**
 * Get the profile of the currently logged-in user.
 * Requires auth middleware (req.user must be set).
 */
export const getProfile = async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};
