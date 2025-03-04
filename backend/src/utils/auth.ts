import { Request } from 'express';
import prisma from '../database/client';

export const getUserFromRequest = async (req: Request) => {
  try {
    if (!req.user) {
      return null;
    }
    
    return await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error('[Auth] Error getting user from request:', error);
    return null;
  }
}; 