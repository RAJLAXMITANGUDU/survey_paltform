import User from '../models/userModel.js';
import { generateToken } from '../utils/token.js';

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    // 1. Validate input (basic example; you can enhance with express-validator)
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          email: !email ? ['Email is required'] : undefined,
          password: !password ? ['Password is required'] : undefined,
          name: !name ? ['Name is required'] : undefined,
        },
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        errors: { email: ['This email is already registered'] },
      });
    }
    const newUser = await User.create({ email, password, name });
    const token = generateToken({ userId: newUser._id, email: newUser.email });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          created_at: newUser.created_at,
        },
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: {
          email: !email ? ['Email is required'] : undefined,
          password: !password ? ['Password is required'] : undefined,
        },
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const token = generateToken({ userId: user._id, email: user.email });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          
        },
      },
    });
  } catch (err) {
    return next(err);
  }
}