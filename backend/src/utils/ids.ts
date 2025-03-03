import { randomBytes } from 'crypto';

export const generateId = (length: number = 21): string => {
  return randomBytes(length)
    .toString('base64')
    .replace(/[+/]/g, '')
    .substring(0, length);
}; 