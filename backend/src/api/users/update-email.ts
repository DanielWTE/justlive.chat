import { Request, Response } from 'express';
import prisma from '../../database/client';
import { getUserFromRequest } from '../../utils/auth';
import bcrypt from 'bcrypt';

export const handleUpdateEmail = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email, currentPassword } = req.body;

    // Validate input
    if (!email || !currentPassword) {
      return res.status(400).json({ error: 'Email and current password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== user.id) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Verify current password
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    });

    if (!fullUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, fullUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update user email
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email },
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
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 