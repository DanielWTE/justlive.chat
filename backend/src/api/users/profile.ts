import { Request, Response } from 'express';
import { findUserById } from '../../database/fetch';
import { updateUser } from '../../database/update';

export const handleUserProfile = async (req: Request, res: Response) => {
  try {
    // The user ID should be set by the auth middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email, name } = req.body;
    const updatedUser = await updateUser(userId, { email, name });

    const { password: _, ...userData } = updatedUser;
    res.json(userData);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 