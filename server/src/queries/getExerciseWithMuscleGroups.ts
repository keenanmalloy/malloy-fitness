import { db } from 'config/db';
import { getMuscleGroups } from './getMuscleGroups';

interface getExerciseWithMuscleGroupsParams {
  exerciseId: string;
  accountId: string;
}

export const getExerciseWithMuscleGroups = async ({
  exerciseId,
  accountId,
}: getExerciseWithMuscleGroupsParams) => {
  const query = `SELECT * FROM exercises WHERE exercise_id = $1 AND (created_by = $2 OR view = 'public')`;
  const params = [exerciseId, accountId];
  const data = await db.query(query, params);

  if (!data.rows.length) throw new Error('Exercise not found');
  const muscleGroups = await getMuscleGroups(exerciseId);

  const exercise = {
    ...data.rows[0],
    primary: muscleGroups
      .filter((mg) => mg.muscle_group === 'primary')
      .map((mg) => {
        return {
          name: mg.muscle_group_name,
          description: mg.muscle_group_description,
          muscle_group_id: mg.muscle_group_id,
          group: mg.muscle_group,
        };
      }),
    secondary: muscleGroups
      .filter((mg) => mg.muscle_group === 'secondary')
      .map((mg) => {
        return {
          name: mg.muscle_group_name,
          description: mg.muscle_group_description,
          muscle_group_id: mg.muscle_group_id,
          group: mg.muscle_group,
        };
      }),
  };

  return exercise;
};
