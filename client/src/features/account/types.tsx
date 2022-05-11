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
  height: string;
  country: string;
  city: string;
}

export interface GetAccountResponse extends SharedResponse {
  account: Account;
}

export interface Goals {
  daily_steps_goal: number;
  weekly_cardio_minutes_goal: number;
  body_weight_goal: number;
}

export interface GetGoalsResponse extends SharedResponse {
  goals: Goals;
}
