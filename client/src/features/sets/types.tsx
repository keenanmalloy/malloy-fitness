export interface SharedResponse {
  role: string;
  message: string;
  status: string;
}

export interface GetSetsResponse extends SharedResponse {
  sets: Set[];
}

export interface Set {
  set_id: string;
  created_at: string;
  updated_at: string;
  repetitions: number;
  weight: number;
  workout_id: any;
  exercise_id: string;
  set_order: number;
  session_id: string;
}
