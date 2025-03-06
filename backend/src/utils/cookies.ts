import { Response } from 'express';

export const setCookie = (res: Response, token: string): void => {
  let domain = process.env.FRONTEND_URL?.replace('https://', '').replace('http://', '').replace('www.', '') || 'localhost';
  domain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
  res.cookie('justlivechat_token', token, {
    domain: process.env.APP_ENV === 'production' ? `.${domain}` : 'localhost',
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

export const clearCookie = (res: Response): void => {
  let domain = process.env.FRONTEND_URL?.replace('https://', '').replace('http://', '').replace('www.', '') || 'localhost';
  domain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
  res.clearCookie('justlivechat_token', {
    domain: process.env.APP_ENV === 'production' ? `.${domain}` : 'localhost',
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'lax'
  });
};