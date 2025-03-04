import { Response } from 'express';

export const setCookie = (res: Response, token: string): void => {
  res.cookie('justlivechat_token', token, {
    domain: process.env.NODE_ENV === 'production' ? '.justlive.chat' : 'localhost',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const clearCookie = (res: Response): void => {
  res.clearCookie('justlivechat_token', {
    domain: process.env.NODE_ENV === 'production' ? '.justlive.chat' : 'localhost',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
}; 