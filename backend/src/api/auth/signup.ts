import { Request, Response } from 'express';
import { createUser } from '../../database/create';
import { findUserByEmail } from '../../database/fetch';
import { createToken } from '../../utils/jwt';
import { setCookie } from '../../utils/cookies';

export const handleAuthRegister = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await createUser(email, password, name);

    // Generate token and set cookie
    const token = createToken(user);
    setCookie(res, token);

    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    res.status(201).json(userData);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 