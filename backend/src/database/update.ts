import prisma from './client';
import bcrypt from 'bcrypt';

export const updateUser = async (id: string, data: { email?: string; name?: string }) => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const updateUserPassword = async (id: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  });
};

export const updateWebsite = async (id: string, data: { name?: string; domain?: string }) => {
  return prisma.website.update({
    where: { id },
    data
  });
}; 