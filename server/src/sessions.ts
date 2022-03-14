import Iron from "@hapi/iron";
import { getTokenCookie, MAX_AGE, setTokenCookie } from "./cookies";
import { Request, Response } from "express";
import { toTimestampz, toUnix } from "time";

const TOKEN_SECRET = `6SZ=3f<Gtxd3E^7J=.sfxXGd!9pKhcq`;

interface User {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string;
  stripe_account_id: string | null;
}

interface Session {
  jwt_token: string;
  jwt_expires_in: number;
  user: User;
  refresh_token: string;
  createdAt: string;
  maxAge: number;
}

export async function setLoginSession(
  res: Response,
  session: any
): Promise<void> {
  const createdAt = new Date();
  const obj = { ...session, createdAt, maxAge: MAX_AGE };

  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token);
}

export async function getLoginSession(req: Request): Promise<Session | null> {
  const token = getTokenCookie(req);
  if (!token) throw new Error("Missing token from session");

  const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults);

  const expiresAt = toUnix(new Date(session.createdAt)) + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (new Date() > toTimestampz(expiresAt)) {
    throw new Error("Session expired");
  }

  return session;
}
