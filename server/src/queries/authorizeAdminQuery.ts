import { db } from "config/db";
import { Response } from "express";

export const authorizeAdminQuery = async (
  res: Response
): Promise<{
  isAdmin: boolean;
}> => {
  const accountId = res.locals.state.account.account_id;

  const query = `SELECT * FROM accounts WHERE account_id = $1 AND role = 'developer'`;
  const params = [accountId];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return {
        isAdmin: false,
      };
    }

    return {
      isAdmin: true,
    };
  } catch (error) {
    console.log({ error });
    return {
      isAdmin: false,
    };
  }
};
