import Iron from "@hapi/iron";
import { getTokenCookie, MAX_AGE, setTokenCookie } from "./cookies";
import { Request, Response } from "express";
import { toTimestampz, toUnix } from "time";

const TOKEN_SECRET = `6SZ=3f<Gtxd3E^7J=.sfxX238nf27o3fnGd!9pKhcq`;

interface Account {
  name: string;
  account_id: string;
  email: string;
  active: boolean;
  avatar_url: string;
  role: string | null;
  ticket: string;
  ticket_expiry: string;
}

interface Session {
  account: Account;
  createdAt: string;
  maxAge: number;
}

export const generateAuthToken = async (obj: Session) => {
  return await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);
};

export async function setLoginSession(
  res: Response,
  session: any
): Promise<void> {
  const createdAt = new Date();
  const obj = { ...session, createdAt, maxAge: MAX_AGE };
  const token = await generateAuthToken(obj);
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
