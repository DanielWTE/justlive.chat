import { Request, Response } from 'express';
import prisma from '../../database/client';
import { getUserFromRequest } from '../../utils/auth';

export const handleUpdateName = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 30) {
      return res.status(400).json({ error: 'Name must be between 2 and 30 characters' });
    }

    // Update user name
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update name error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 