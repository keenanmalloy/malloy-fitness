import { MuscleGroup } from 'features/muscle-groups/types';

export interface Exercise {
  name: string;
  video: string;
  exercise_id: string;
  primary_tracker: string;
  secondary_tracker: string;
  profile: string;
  category: string;
  created_by: string;
  description: string;
  view: string;
  type: string;
  order: number;
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
}

interface SharedResponse {
  role: string;
  message: string;
  status: string;
}

export interface GetExercisesResponse extends SharedResponse {
  exercises: Exercise[];
}

export interface GetRelatedExercisesResponse extends SharedResponse {
  exercises: Pick<Exercise, 'name' | 'exercise_id'>[];
}

export interface GetSingleExerciseResponse extends SharedResponse {
  exercise: Exercise & { updated_at: string; created_at: string };
}
