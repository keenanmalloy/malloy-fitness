import { db } from "config/db";

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
              (${account_id}, ${auth_provider}, ${auth_provider_unique_id})
          )
        INSERT INTO sets (account_id, auth_provider, auth_provider_unique_id)
          SELECT account_id, auth_provider, auth_provider_unique_id
            FROM data
          RETURNING *
      `;

  try {
    const data = await db.query(query);
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
  avatarUrl: string;
  email: string;
  locale: string;
}

export const createAccountWithProviderMutation = async (
  data: createAccountWithProvider
) => {
  const { provider, authProviderUniqueId, name, avatarUrl, email, locale } =
    data;

  const query = `
        WITH ins1 AS (
            INSERT INTO accounts(name, avatar_url, email)
            VALUES ('${name}', '${avatarUrl}', '${email}')
            RETURNING account_id
        )
        INSERT INTO account_providers (account_id, auth_provider, auth_provider_unique_id)
            SELECT account_id, '${provider}', '${authProviderUniqueId}' FROM ins1
            RETURNING account_id
        `;

  try {
    const data = await db.query(query);
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
