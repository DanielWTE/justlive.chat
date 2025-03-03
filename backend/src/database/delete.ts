import prisma from './client';

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id }
  });
};

export const deleteWebsite = async (id: string) => {
  return prisma.website.delete({
    where: { id }
  });
}; 