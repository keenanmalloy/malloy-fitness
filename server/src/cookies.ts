import { serialize, parse } from 'cookie';
import { Request, Response } from 'express';

const TOKEN_NAME = 'token';

export const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setTokenCookie(
  res: Response,
  token: string,
  tokenName: string = TOKEN_NAME
) {
  const cookie = serialize(tokenName, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'none',
    domain: `${
      //@@TODO set domain in cookie
      process.env.NODE_ENV === 'production' ? `.trckd.ca` : `localhost`
    }`,
  });

  res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(
  res: Response,
  tokenName: string = TOKEN_NAME
) {
  const cookie = serialize(tokenName, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: Request) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function getTokenCookie(req: Request, tokenName: string = TOKEN_NAME) {
  const cookies = parseCookies(req);
  return cookies[tokenName];
}
