import { Request, Response } from 'express';
import prisma from '../../database/client';
import { getUserFromRequest } from '../../utils/auth';
import bcrypt from 'bcrypt';

export const handleUpdatePassword = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 