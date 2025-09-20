// JWT Authentication Configuration
export const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

// Helper function to verify JWT token
export function verifyToken(token: string) {
  try {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Helper function to create JWT token
export function createToken(payload: any) {
  try {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    return null;
  }
}