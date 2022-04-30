import { db } from 'config/db';
import { Request, Response } from 'express';

export const retrieveAccountByProviderQuery = async (
  providerUniqueId: string,
  provider: 'google'
) => {
  const query = `
SELECT
  name,
  email,
  active,
  avatar_url,
  accounts.account_id as account_id,
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
    const accountId = res.locals.state.account.account_id;
    const data = await db.query(
      `SELECT * FROM accounts WHERE account_id = $1`,
      [accountId]
    );

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'User logged in',
      account: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Session does not exist',
      account: null,
    });
  }
};
