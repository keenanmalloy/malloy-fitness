import { faker } from '@faker-js/faker';
import { db } from 'config/db';
import { createEmptyWorkout } from 'queries/workouts';

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

export const deleteAllTestWorkouts = async () => {
  const query = `DELETE FROM workouts;`;
  const data = await db.query(query);
  return data;
};
