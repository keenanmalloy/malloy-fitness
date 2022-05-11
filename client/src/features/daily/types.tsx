export interface GetDailyResponse extends SharedResponse {
  sessions: Session[];
  steps: number;
  goals: Goals;
}

interface Goals {
  setting_id: string;
  updated_at: string;
  account_id: string;
  unit_preference: string;
  appearance: string;
  daily_steps_goal: number;
  weekly_cardio_minutes_goal: number;
  body_weight_goal: number;
}

interface SharedResponse {
  role: string;
  status: string;
  message: string;
}

export interface Session {
  workout_id: string;
  created_by: string;
  name: string;
  description: string;
  category: string;
  type: string;
  view: string;
  session_id: string;
  started_at: string;
  ended_at: any;
  session_dt: string;
  completed: boolean;
  video: string;
  deload: boolean;
}

export type SelectedDate = {
  day: number;
  month: number;
  year: number;
  id: string;
};
