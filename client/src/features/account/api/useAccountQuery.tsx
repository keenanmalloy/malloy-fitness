import { useQuery } from 'react-query';
import { apiClient } from 'config/axios';
import { z } from 'zod';

const getAccountSchema = z.object({
  status: z.string(),
  message: z.string(),
  account: z.object({
    account_id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    name: z.string(),
    email: z.string(),
    active: z.boolean(),
    dob: z.nullable(z.string()),
    avatar_url: z.string(),
    role: z.string(),
    ticket: z.string(),
    ticket_expiry: z.string(),
    description: z.nullable(z.string()),
    phone: z.nullable(z.string()),
    locale: z.string(),
  }),
});

export type GetAccountSchema = z.infer<typeof getAccountSchema>;

const fetchAccount = async () => {
  const { data } = await apiClient.get(`/auth/me`);
  const result = getAccountSchema.parse(data);
  return result;
};

export const useAccountQuery = () => {
  return useQuery<GetAccountSchema>('fetchAccount', fetchAccount);
};
