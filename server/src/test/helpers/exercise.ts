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
  primaryTracker?: string;
  secondaryTracker?: string;
  profile?: string;
  category?: string;
  createdBy?: string;
  description?: string;
  type?: string;
  view?: string;
}

export const createTestExercise = async (
  accountId: string,
  overrides?: Overrides
) => {
  const exercise = await createExercise({
    category: faker.helpers.arrayElement(EXERCISE_CATEGORIES),
    description: faker.lorem.sentence(),
    name: faker.lorem.word(),
    primaryTracker: faker.helpers.arrayElement(EXERCISE_TRACKERS),
    secondaryTracker: faker.helpers.arrayElement(EXERCISE_TRACKERS),
    profile: faker.helpers.arrayElement(EXERCISE_PROFILES),
    createdBy: accountId,
    type: faker.helpers.arrayElement(EXERCISE_TYPES),
    video: faker.image.imageUrl(),
    ...overrides,
  });

  return exercise;
};

export const deleteAllTestExercises = async () => {
  const query = `DELETE FROM exercises;`;
  const data = await db.query(query);
  return data;
};
