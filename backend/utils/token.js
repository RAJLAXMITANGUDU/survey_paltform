import jwt from 'jsonwebtoken';


export function generateToken(payload, options = {}) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Default token options (you can override via `options`)
  const signOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h', // e.g. '7d', '1h', etc.
    ...options,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, signOptions);
}