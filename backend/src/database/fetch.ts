import prisma from './client';

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
}; 