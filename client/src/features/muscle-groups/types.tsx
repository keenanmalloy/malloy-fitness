export interface MuscleGroup {
  description: string | null;
  image: string | null;
  muscle_group_id: string;
  name: string;
}

export type MuscleGroups = MuscleGroup[];

export type MutateMuscleGroupArgs = Pick<
  MuscleGroup,
  'description' | 'name' | 'image'
>;

export interface GetMuscleGroupResponse extends SharedResponse {
  muscleGroup: MuscleGroup;
}

export interface GetMuscleGroupsResponse extends SharedResponse {
  muscleGroups: MuscleGroup[];
}

interface SharedResponse {
  message: string;
  role: string;
  status: string;
}
