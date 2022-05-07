export interface GetDailyResponse extends SharedResponse {
  sessions: Session[];
  steps: number;
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
