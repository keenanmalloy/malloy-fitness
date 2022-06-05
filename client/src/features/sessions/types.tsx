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
  exercise_order: string[];
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
  notes: string;
}

export interface Set {
  set_id: string;
  set_order: number;
  repetitions: number;
  weight: number;
}

export interface SessionSummaryResponse extends SharedResponse {
  session: {
    name: string;
    category: string;
    type: string;
    session_id: string;
    workout_id: string;
    started_at: string;
    exercise_order: string[];
    readiness_energy: number | null;
    readiness_mood: number | null;
    readiness_stress: number | null;
    readiness_soreness: number | null;
    readiness_sleep: number | null;
    ended_at: any;
    completed: boolean;
    exercises: {
      name: string;
      exercise_id: string;
      workout_task_id: string;
      workout_task_exercise_id: string;
      video: string;
      primary_tracker: string;
      secondary_tracker: string;
      sets: Set[];
    }[];
  };
}

export interface GetSessionExerciseResponse extends SharedResponse {
  exercise: ExtendedExercise;
  record: any[];
  next: {
    order: {
      workoutTaskId: string;
    };
  };
  prev: {
    order: {
      workoutTaskId: string;
    };
  };
}
interface ExtendedExercise {
  exercise_id: string;
  name: string;
  description: string;
  category: string;
  video: string;
  profile: string;
  view: string;
  workout_id: string;
  notes: any;
}
