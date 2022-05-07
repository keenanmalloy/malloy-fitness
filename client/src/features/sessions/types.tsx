export interface SharedResponse {
  role: string;
  status: string;
  message: string;
}

export interface GetSessionResponse extends SharedResponse {
  session: Session;
}

export interface Session {
  session_id: string;
  workout_id: string;
  created_at: string;
  updated_at: string;
  started_at: string;
  ended_at: any;
  session_dt: string;
  completed: boolean;
  deload: boolean;
  created_by: string;
  name: string;
  description: string;
  category: string;
  type: string;
  view: string;
  exercises: Exercise[];
}

export interface Exercise {
  exercise_id: string;
  name: string;
  repetitions: any;
  reps_in_reserve: any;
  sets: any;
  rest_period: any;
  order: number;
  priority: number;
  notes: any;
}

export interface Set {
  set_id: string;
  set_order: number;
  repetitions: number;
  weight: number;
  primary_tracker: string;
  secondary_tracker: string;
}

export interface SessionSummaryResponse extends SharedResponse {
  session: {
    name: string;
    category: string;
    type: string;
    session_id: string;
    workout_id: string;
    started_at: string;
    ended_at: any;
    completed: boolean;
    exercises: {
      name: string;
      exercise_id: string;
      video: string;
      sets: Set[];
    }[];
  };
}
