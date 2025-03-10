import prisma from './client';
import bcrypt from 'bcrypt';

export const createUser = async (email: string, password: string, name: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });
};

export const createWebsite = async (userId: string, name: string, domain: string) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!userExists) {
    throw new Error(`User with ID ${userId} does not exist`);
  }
  
  return prisma.website.create({
    data: {
      name,
      domain,
      userId
    }
  });
}; 