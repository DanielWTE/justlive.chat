import { prisma } from './prisma';

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

export const findWebsiteById = async (id: string) => {
  return prisma.website.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      domain: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const findWebsitesByUserId = async (userId: string) => {
  return prisma.website.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      domain: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
}; 

export const getWebsiteByDomain = async (domain: string) => {
  return prisma.website.findFirst({
    where: { domain }
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id }
  });
};