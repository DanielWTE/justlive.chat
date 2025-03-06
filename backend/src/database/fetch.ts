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

export const isDomainRegistered = async (domain: string): Promise<boolean> => {
  // Clean the domain for comparison
  const cleanDomain = domain.toLowerCase()
    .replace(/^https?:\/\//, '')  // Remove protocol
    .replace(/:\d+$/, '')         // Remove port
    .replace(/\/$/, '');          // Remove trailing slash
  
  // Find all websites
  const websites = await prisma.website.findMany({
    select: { domain: true }
  });
  
  // Check if the domain matches or is a subdomain of any registered website
  return websites.some(website => {
    const websiteDomain = website.domain.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/:\d+$/, '')
      .replace(/\/$/, '');
    
    // Check if domains match exactly or if request domain is a subdomain
    return cleanDomain === websiteDomain || 
           cleanDomain.endsWith(`.${websiteDomain}`) ||
           websiteDomain.endsWith(`.${cleanDomain}`);
  });
};

// Get all registered domains for caching
export const getAllRegisteredDomains = async (): Promise<string[]> => {
  const websites = await prisma.website.findMany({
    select: { domain: true }
  });
  
  return websites.map(website => {
    // Clean the domain for consistency
    return website.domain.toLowerCase()
      .replace(/^https?:\/\//, '')  // Remove protocol
      .replace(/:\d+$/, '')         // Remove port
      .replace(/\/$/, '');          // Remove trailing slash
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id }
  });
};