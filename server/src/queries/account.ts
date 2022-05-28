import { db } from 'config/db';
import { accounts_table, account_providers_table } from 'utils/databaseTypes';

interface CreateAccountSettings {
  accountId: string;
}

export const createAccountSettings = async ({
  accountId,
}: CreateAccountSettings) => {
  const query = `INSERT INTO settings (account_id) VALUES ($1) RETURNING account_id`;
  const data = await db.query<Pick<accounts_table, 'account_id'>>(query, [
    accountId,
  ]);
  return data.rows[0];
};

interface createAccountProvider {
  account_id: string;
  auth_provider: string;
  auth_provider_unique_id: string;
}

export const createAccountProviderMutation = async (
  data: createAccountProvider
) => {
  const { account_id, auth_provider, auth_provider_unique_id } = data;

  const query = `
      WITH 
        data(account_id, auth_provider, auth_provider_unique_id) AS (
          VALUES                           
              (${account_id}, '${auth_provider}', '${auth_provider_unique_id}')
          )
        INSERT INTO account_providers (account_id, auth_provider, auth_provider_unique_id)
          SELECT account_id, auth_provider, auth_provider_unique_id
            FROM data
          RETURNING *
      `;

  try {
    const data = await db.query<account_providers_table>(query);
    const accountProvider = data.rows[0];
    return accountProvider;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

interface createAccountWithProvider {
  provider: string;
  authProviderUniqueId: string;

  name: string;
  familyName: string;
  givenName: string;
  avatarUrl: string;
  email: string;
  locale: string;
}

export const createAccountWithProviderMutation = async (
  data: createAccountWithProvider
) => {
  const {
    provider,
    authProviderUniqueId,
    name,
    avatarUrl,
    email,
    locale,
    familyName,
    givenName,
  } = data;

  const query = `
        WITH ins1 AS (
            INSERT INTO accounts(name, avatar_url, email, family_name, given_name, locale, role)
            VALUES ($1, $2, $3, $4, $5, $6, 'user')
            RETURNING account_id
        )
        INSERT INTO account_providers (account_id, auth_provider, auth_provider_unique_id)
            SELECT account_id, '${provider}', '${authProviderUniqueId}' FROM ins1
            RETURNING account_id
        `;

  try {
    const data = await db.query<
      NonNullable<Pick<account_providers_table, 'account_id'>>
    >(query, [name, avatarUrl, email, familyName, givenName, locale]);
    const account = data.rows[0];
    return {
      account_id: account.account_id,
      name,
      avatarUrl,
      email,
    };
  } catch (error) {
    console.log({ error });
    return null;
  }
};

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
    const data = await db.query<
      Pick<
        accounts_table,
        | 'name'
        | 'email'
        | 'active'
        | 'avatar_url'
        | 'account_id'
        | 'role'
        | 'ticket'
        | 'ticket_expiry'
      >
    >(query, params);
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
    const data = await db.query<
      Pick<
        accounts_table,
        | 'name'
        | 'email'
        | 'active'
        | 'avatar_url'
        | 'account_id'
        | 'role'
        | 'ticket'
        | 'ticket_expiry'
      >
    >(query, params);
    return data.rows[0];
  } catch (error) {
    console.log({ error });
    return null;
  }
};
