import { Request, Response } from 'express';
import { getUserFromRequest } from '../../utils/auth';

export const handleUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 