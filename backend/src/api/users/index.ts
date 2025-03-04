import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { handleUpdateName } from './update-name';
import { handleUpdateEmail } from './update-email';
import { handleUpdatePassword } from './update-password';
import { handleUserProfile } from './profile';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', handleUserProfile);

// Update user name
router.put('/update-name', handleUpdateName);

// Update user email
router.put('/update-email', handleUpdateEmail);

// Update user password
router.put('/update-password', handleUpdatePassword);

export default router; 