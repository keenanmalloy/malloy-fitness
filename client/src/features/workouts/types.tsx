export interface SharedResponse {
  role: string;
  status: string;
  message: string;
}

export interface GetWorkoutResponse extends SharedResponse {
  workout: Workout;
}

export interface GetWorkoutsReponse extends SharedResponse {
  workouts: WorkoutInList[];
}

export interface Workout extends CommonWorkoutFields {
  exercises: Exercise[];
  hasSessions: boolean;
}

interface CommonWorkoutFields {
  workout_id: string;
  name: string;
  description: string;
  category: string;
  type: string;
}

export interface EditableWorkoutFields
  extends Partial<Omit<CommonWorkoutFields, 'workout_id' | 'type'>> {}

export interface WorkoutInList extends CommonWorkoutFields {
  created_at: string;
  updated_at: string;
  created_by: string;
  view: string;
}

interface Exercise {
  name: string;
  description: string;
  exercise_id: string;
  category: string;
  profile: string;
  video: string;
  order: number;
  priority: number;
  notes: any;
  sets: any;
  repetitions: any;
  repsInReserve: any;
  restPeriod: any;
}
