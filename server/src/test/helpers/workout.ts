import { faker } from '@faker-js/faker';
import { db } from 'config/db';
import {
  createEmptyWorkout,
  createWorkout,
  updateWorkoutTaskOrder,
} from 'queries/workouts';
import { createTasksAndTaskExercises } from 'queries/workoutTasks';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from './env';
import { createTestExercise } from './exercise';
import { v4 as uuidv4 } from 'uuid';

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
    session_dt: overrides?.session_dt || faker.date.recent().toISOString(),
    category: overrides?.category || 'strength',
  });

  return workoutId;
};

export const createFullTestWorkout = async (
  accountId: string,
  overrides?: Overrides & {
    description: string;
    name: string;
    type: string;
  }
) => {
  const workoutId = await createWorkout({
    accountId,
    description: overrides?.description || faker.lorem.paragraph(),
    name: overrides?.name || faker.lorem.sentence(),
    type: overrides?.type || faker.helpers.arrayElement(WORKOUT_TYPES),
    category:
      overrides?.category || faker.helpers.arrayElement(WORKOUT_CATEGORIES),
  });

  const exercises = await Promise.all([
    createTestExercise(accountId),
    createTestExercise(accountId),
    createTestExercise(accountId),
  ]);

  const exercisesToAdd = exercises.slice(0, 2);
  const exerciseToAdd = exercises[2];

  const workoutTaskIds = await createTasksAndTaskExercises({
    workoutId,
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
    workoutId,
  });

  return workoutId;
};

export const deleteAllTestWorkouts = async () => {
  const query = `DELETE FROM workouts;`;
  const data = await db.query(query);
  return data;
};
