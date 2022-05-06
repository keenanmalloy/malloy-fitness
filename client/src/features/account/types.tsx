export interface SharedResponse {
  role: string;
  status: string;
  message: string;
}

export interface Account {
  account_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  active: boolean;
  avatar_url: string;
  role: string;
  ticket: string;
  ticket_expiry: string;
  given_name: string;
  family_name: string;
  description: string;
  phone: string;
  gender: string;
  dob: string;
  weight: number;
  height: number;
  country: string;
  city: string;
}

export interface GetAccountResponse extends SharedResponse {
  account: Account;
}
