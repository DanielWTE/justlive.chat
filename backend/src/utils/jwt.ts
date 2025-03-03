import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): { userId: string; email: string } => {
  try {
    console.log(`[JWT] Verifying token: ${token.substring(0, 10)}...`);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    console.log(`[JWT] Token verified for user: ${decoded.email}`);
    return decoded;
  } catch (error) {
    console.error('[JWT] Token verification failed:', error);
    throw new Error('Invalid token');
  }
}; 