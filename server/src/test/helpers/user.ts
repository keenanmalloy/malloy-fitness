import { faker } from '@faker-js/faker';
import { serialize } from 'cookie';
import { MAX_AGE } from 'cookies';
import {
  createAccountSettings,
  createAccountWithProviderMutation,
} from 'queries/account';
import { generateAuthToken, Session } from 'sessions';

import { v4 as uuidv4 } from 'uuid';

export const createAndAuthorizeUser = async () => {
  const randomEmail = faker.internet.email();
  const fakeAuthProviderId = uuidv4();
  const fakeProvider = faker.helpers.arrayElement(['google', 'facebook']);

  const account = await createAccountWithProviderMutation({
    authProviderUniqueId: fakeAuthProviderId,
    provider: fakeProvider,
    name: faker.name.findName(),
    avatarUrl: faker.internet.avatar(),
    email: randomEmail,
    locale: faker.locale,
    familyName: faker.name.lastName(),
    givenName: faker.name.firstName(),
  });

  await createAccountSettings({
    accountId: account!.account_id!,
  });

  const session: Session = {
    account: {
      ticket: uuidv4(),
      ticket_expiry: '',
      account_id: account!.account_id!,
      active: true,
      avatar_url: account!.avatarUrl!,
      email: account!.email,
      name: account!.name,
      role: 'user',
    },
    createdAt: new Date().toISOString(),
    maxAge: MAX_AGE,
  };

  const authToken = await generateAuthToken(session);
  const cookie = serialize('token', authToken, {
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

  return { cookie, accountId: account!.account_id! };
};

export const createAndAuthorizeDeveloper = async () => {
  const randomEmail = faker.internet.email();
  const fakeAuthProviderId = uuidv4();
  const fakeProvider = faker.helpers.arrayElement(['google', 'facebook']);

  const account = await createAccountWithProviderMutation({
    authProviderUniqueId: fakeAuthProviderId,
    provider: fakeProvider,
    name: faker.name.findName(),
    avatarUrl: faker.internet.avatar(),
    email: randomEmail,
    locale: faker.locale,
    familyName: faker.name.lastName(),
    givenName: faker.name.firstName(),
  });

  await createAccountSettings({
    accountId: account!.account_id!,
  });

  const session: Session = {
    account: {
      ticket: uuidv4(),
      ticket_expiry: '',
      account_id: account!.account_id!,
      active: true,
      avatar_url: account!.avatarUrl!,
      email: account!.email,
      name: account!.name,
      role: 'developer',
    },
    createdAt: new Date().toISOString(),
    maxAge: MAX_AGE,
  };

  const authToken = await generateAuthToken(session);
  const cookie = serialize('token', authToken, {
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

  return { cookie, accountId: account!.account_id! };
};
