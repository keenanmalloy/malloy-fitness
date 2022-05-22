import { db } from 'config/db';
import { workouts_table } from 'utils/databaseTypes';
import { inferCloneName } from 'utils/inferCloneName';
import { queryTaskExercisesByWorkoutId } from './workoutTaskExercises';

interface CloneWorkoutParams {
  workoutId: string;
  accountId: string;
}

export const cloneWorkout = async ({
  workoutId,
  accountId,
}: CloneWorkoutParams) => {
  const workout = await retrieveWorkoutQuery(workoutId);
  if (!workout) throw new Error('Workout not found');
  const workoutQuery = `
          WITH
            workoutdata(name, description, category, created_by, type) AS (
              VALUES
                  ('${inferCloneName(workout.name as string)}', '${
    workout.description
  }', '${workout.category}', ${accountId}, '${workout.type}')
              )
            INSERT INTO workouts (name, description, category, created_by, type)
              SELECT *
                FROM workoutdata
              RETURNING *
          `;

  const data = await db.query(workoutQuery);
  const createdWorkoutId = data.rows[0].workout_id;
  return {
    oldWorkout: workout,
    newWorkoutId: createdWorkoutId,
  };
};

export const queryWorkoutById = async (workoutId: string) => {
  const query = `SELECT 
    name,
    description,
    category,
    workout_id,
    type,
    created_by,
    task_order
  FROM workouts
  WHERE workout_id = $1`;
  const params = [workoutId];

  const data = await db.query<
    Pick<
      workouts_table,
      | 'name'
      | 'description'
      | 'category'
      | 'workout_id'
      | 'type'
      | 'created_by'
      | 'task_order'
    >
  >(query, params);
  return data.rows[0];
};

export const retrieveWorkoutQuery = async (workoutId: string) => {
  try {
    const workout = await queryWorkoutById(workoutId);
    const taskExercises = await queryTaskExercisesByWorkoutId(workoutId);

    const data = {
      name: workout.name,
      description: workout.description,
      category: workout.category,
      workout_id: workout.workout_id,
      type: workout.type,
      task_order: workout.task_order as string[],
      tasks: taskExercises,
    };

    return data;
  } catch (error) {
    return null;
  }
};

interface UpdateWorkoutTaskOrder {
  workoutId: string;
  taskOrder: string;
}

export const updateWorkoutTaskOrder = async ({
  workoutId,
  taskOrder,
}: UpdateWorkoutTaskOrder): Promise<string> => {
  const query = `UPDATE workouts SET task_order = $1 WHERE workout_id = $2 RETURNING workout_id`;
  const data = await db.query(query, [taskOrder, workoutId]);
  return data.rows[0].workout_id;
};
