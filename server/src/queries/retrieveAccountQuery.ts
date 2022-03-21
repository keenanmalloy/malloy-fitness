import { db } from "config/db";
import { Request, Response } from "express";
import { getLoginSession } from "sessions";

export const retrieveAccountByProviderQuery = async (
  providerUniqueId: string,
  provider: "google"
) => {
  const query = `
SELECT
  name,
  email,
  active,
  avatar_url,
  account_id,
  role,
  ticket,
  ticket_expiry
FROM accounts
JOIN account_providers ap
   on accounts.account_id = ap.account_id
WHERE ap.auth_provider_unique_id = $1
AND auth_provider = $2
  `;

  const params = [providerUniqueId, provider];

  try {
    const data = await db.query(query, params);
    return data.rows[0];
  } catch (error) {
    console.log({ error });
    return null;
  }
};

export const retrievAccountByEmailQuery = async (email: string) => {
  const query = `
SELECT
  name,
  account_id,
  email,
  active,
  avatar_url,
  role,
  ticket,
  ticket_expiry
FROM accounts
WHERE email = $1
  `;

  const params = [email];

  try {
    const data = await db.query(query, params);
    return data.rows[0];
  } catch (error) {
    console.log({ error });
    return null;
  }
};

export const retrieveMeQuery = async (req: Request, res: Response) => {
  try {
    const session = await getLoginSession(req);
    if (!session) {
      throw new Error("Not logged in");
    }

    return res.json({
      status: "success",
      message: "User logged in",
      session,
    });
  } catch (error) {
    console.log({ error });
    return res.json({
      status: "error",
      message: "Session does not exist",
      session: null,
    });
  }
};
