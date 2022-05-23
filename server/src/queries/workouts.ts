import { db } from 'config/db';
import { workouts_table } from 'utils/databaseTypes';
import { inferCloneName } from 'utils/inferCloneName';
import { queryTaskExercisesByWorkoutId } from './workoutTaskExercises';

interface CloneWorkoutParams {
  workoutId: string;
  accountId: string;
}

/**
 * Clones the workout on the workouts table.
 * To clone the exercises:
 * Pass the new workoutId to the ```cloneWorkoutTasksWithExercises```
 */
export const cloneWorkout = async ({
  workoutId,
  accountId,
}: CloneWorkoutParams) => {
  const workout = await retrieveWorkoutQuery(workoutId);
  if (!workout) throw new Error('Workout not found');

  const clonedName = inferCloneName(workout.name as string);
  const workoutQuery = `
          WITH
            workoutdata(name, description, category, created_by, type) AS (
              VALUES
                  (
                    '${clonedName}', 
                    '${workout.description}', 
                    '${workout.category}', 
                    ${accountId}, 
                    '${workout.type}'
                  )
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

/**
 * Clones and schedules the workout.
 * To clone the exercises:
 * Pass the new workoutId to the ```cloneWorkoutTasksWithExercises```
 */
export const cloneScheduleWorkout = async ({
  workoutId,
  accountId,
  date,
}: CloneWorkoutParams & { date: string }) => {
  const workout = await retrieveWorkoutQuery(workoutId);
  if (!workout) throw new Error('Workout not found');

  const distinguishDate = (date: string) => {
    switch (date) {
      case 'today':
        return 'CURRENT_DATE';
      case 'tomorrow':
        return "CURRENT_DATE + INTERVAL '1 day'";
      default:
        return `TO_TIMESTAMP('${date}', 'YYYY-MM-DD')`;
    }
  };

  const clonedName = inferCloneName(workout.name as string);
  const workoutDt = distinguishDate(date);

  const workoutQuery = `
          WITH
            workoutdata(name, description, category, created_by, type, workout_dt) AS (
              VALUES
                  (
                    '${clonedName}', 
                    '${workout.description}', 
                    '${workout.category}', 
                    ${accountId}, 
                    '${workout.type}',
                    ${workoutDt}
                  )
              )
            INSERT INTO workouts (name, description, category, created_by, type, workout_dt)
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
    Required<
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
