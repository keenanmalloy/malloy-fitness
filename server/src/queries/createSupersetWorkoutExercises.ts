import { db } from 'config/db';

interface CreateWorkoutExerciseParams {
  exerciseIds: string[];
  workoutId: string;
}

export const createSupersetWorkoutExercises = async ({
  exerciseIds,
  workoutId,
}: CreateWorkoutExerciseParams): Promise<string> => {
  const supersetId = await createSuperSet(workoutId);

  const generateWeValues = () => {
    return exerciseIds
      .map((exerciseId) => `(${workoutId}, ${exerciseId}, ${supersetId})`)
      .join(',');
  };

  const query = `
  WITH
    WorkoutExercises(workout_id, exercise_id, superset_id) AS (
        VALUES 
          ${generateWeValues()}
      )
    INSERT INTO workout_exercises (workout_id, exercise_id, superset_id)
      SELECT workout_id, exercise_id, superset_id
        FROM WorkoutExercises
      RETURNING *
`;
  const data = await db.query(query);
  return data.rows[0].exercise_id;
};

const createSuperSet = async (workoutId: string) => {
  const query = `
  INSERT INTO supersets (workout_id)
    VALUES ($1)
    RETURNING superset_id
`;
  const data = await db.query(query, [workoutId]);
  return data.rows[0].superset_id;
};
