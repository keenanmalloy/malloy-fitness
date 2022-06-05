import { faker } from '@faker-js/faker';
import { db } from 'config/db';
import {
  createEmptyWorkout,
  createWorkout,
  updateWorkoutTaskOrder,
} from 'queries/workouts';
import {
  createTasksAndTaskExercises,
  createWorkoutTaskWithExercises,
} from 'queries/workoutTasks';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from './env';
import { createTestExercise } from './exercise';
import { v4 as uuidv4 } from 'uuid';
import {
  workouts_table,
  workout_task_exercises_table,
} from 'utils/databaseTypes';

interface CreateWorkout {
  accountId: string;
  category: string;
  name: string;
  description: string;
  type: string;
}

const insertTestWorkout = async ({
  name,
  description,
  category,
  accountId,
  type,
}: CreateWorkout) => {
  const query = `
  WITH 
    data(name, description, category, created_by, type) AS (
      VALUES                           
          ($1, $2, $3, ${accountId}, $4)
      )
    INSERT INTO workouts (name, description, category, created_by, type)
      SELECT name, description, category, created_by, type
        FROM data
      RETURNING *
  `;

  const data = await db.query<Required<workouts_table>>(query, [
    name,
    description,
    category,
    type,
  ]);
  if (!data.rowCount) throw new Error('Failed to create workout');
  return data.rows[0];
};

interface Overrides {
  category?: string;
  session_dt?: string;
}

export const createTestWorkout = async (
  accountId: string,
  overrides?: Overrides
) => {
  const workoutId = await createEmptyWorkout({
    accountId,
    session_dt: faker.date.recent().toISOString(),
    category: 'strength',
    ...overrides,
  });

  return workoutId;
};

/**
 * Creates a workout with 2 tasks and 3 exercises.
 * The first task has 2 exercises, the second task has 1 exercise.
 */
export const createFullTestWorkout = async (
  accountId: string,
  overrides?: Overrides & {
    description: string;
    name: string;
    type: string;
  }
) => {
  const workout = await insertTestWorkout({
    accountId,
    description: faker.lorem.paragraph(),
    name: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(WORKOUT_TYPES),
    category: faker.helpers.arrayElement(WORKOUT_CATEGORIES),
    ...overrides,
  });

  const exercises = await Promise.all([
    createTestExercise(accountId),
    createTestExercise(accountId),
    createTestExercise(accountId),
  ]);

  const exercisesToAdd = exercises.slice(0, 2);
  const exerciseToAdd = exercises[2];
  const workoutTaskIds = await createTasksAndTaskExercises({
    workoutId: workout.workout_id,
    tasks: [
      {
        id: uuidv4(),
        exercises: exercisesToAdd.map((exercise) => {
          return {
            exercise_id: exercise.exercise_id,
          };
        }),
      },
      {
        id: uuidv4(),
        exercises: [
          {
            exercise_id: exerciseToAdd.exercise_id,
          },
        ],
      },
    ],
  });

  await updateWorkoutTaskOrder({
    taskOrder: JSON.stringify(workoutTaskIds),
    workoutId: workout.workout_id,
  });

  return {
    workout: { ...workout, task_order: workoutTaskIds },
    workoutId: workout.workout_id,
    exerciseIds: exercises.map((exercise) => exercise.exercise_id),
    workoutTaskIds,
  };
};

export const deleteAllTestWorkouts = async () => {
  const query = `DELETE FROM workouts;`;
  const data = await db.query(query);
  return data;
};

export const connectExerciseToWorkout = async (
  exerciseId: string,
  workoutId: string
) => {
  const workout_task_id = await createWorkoutTaskWithExercises({
    workoutId,
    payload: [
      {
        exercise_id: exerciseId,
      },
    ],
  });

  const workoutTaskExercises = await queryWorkoutTaskExercisesByTaskId(
    workout_task_id
  );

  return { workout_task_id, workoutTaskExercises };
};

export const connectManyExercisesToWorkout = async (
  payload: {
    exercise_id: string;
  }[],
  workoutId: string
) => {
  const workout_task_id = await createWorkoutTaskWithExercises({
    workoutId,
    payload,
  });

  const workoutTaskExercises = await queryWorkoutTaskExercisesByTaskId(
    workout_task_id
  );

  return { workout_task_id, workoutTaskExercises };
};

const queryWorkoutTaskExercisesByTaskId = async (taskId: string) => {
  const query = `
    SELECT *
    FROM workout_task_exercises wte 
    JOIN exercises ON wte.exercise_id = exercises.exercise_id
    WHERE workout_task_id = $1
  `;
  const data = await db.query<Required<workout_task_exercises_table>>(query, [
    taskId,
  ]);
  return data.rows;
};
