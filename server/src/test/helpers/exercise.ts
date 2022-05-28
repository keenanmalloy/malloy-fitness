import { faker } from '@faker-js/faker';
import { db } from 'config/db';
import { createExercise } from 'queries/exercises';
import {
  EXERCISE_CATEGORIES,
  EXERCISE_PROFILES,
  EXERCISE_TRACKERS,
  EXERCISE_TYPES,
} from './env';

interface Overrides {
  name?: string;
  video?: string;
  primary_tracker?: string;
  secondary_tracker?: string;
  profile?: string;
  category?: string;
  created_by?: string;
  description?: string;
  type?: string;
  view?: string;
}

export const createTestExercise = async (
  accountId: string,
  overrides?: Overrides
) => {
  const exercise = await createExercise({
    category:
      overrides?.category || faker.helpers.arrayElement(EXERCISE_CATEGORIES),
    description: overrides?.description || faker.lorem.sentence(),
    name: overrides?.name || faker.lorem.word(),
    primaryTracker:
      overrides?.primary_tracker ||
      faker.helpers.arrayElement(EXERCISE_TRACKERS),
    secondaryTracker:
      overrides?.secondary_tracker ||
      faker.helpers.arrayElement(EXERCISE_TRACKERS),
    profile:
      overrides?.profile || faker.helpers.arrayElement(EXERCISE_PROFILES),
    createdBy: accountId,
    type: overrides?.type || faker.helpers.arrayElement(EXERCISE_TYPES),
    video: overrides?.video || faker.image.imageUrl(),
  });

  return exercise;
};

export const deleteAllTestExercises = async () => {
  const query = `DELETE FROM exercises;`;
  const data = await db.query(query);
  return data;
};
