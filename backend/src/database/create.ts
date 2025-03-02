import prisma from './client';
import bcrypt from 'bcrypt';

export const createUser = async (email: string, password: string, name?: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });
}; 