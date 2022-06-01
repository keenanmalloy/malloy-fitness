import { db } from 'config/db';

export const deleteAllAccounts = async () => {
  const query = `DELETE FROM accounts;`;
  const data = await db.query(query);
  return data;
};
