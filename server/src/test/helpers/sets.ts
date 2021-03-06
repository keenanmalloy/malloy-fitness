import { faker } from '@faker-js/faker';
import { db } from 'config/db';
import { createSet } from 'queries/sets';

interface CreateTestSet {
  sessionId: string;
  exerciseId: string;
}

export const createTestSet = async ({
  sessionId,
  exerciseId,
}: CreateTestSet) => {
  const data = await createSet({
    sessionId: sessionId,
    exerciseId: exerciseId,
    weight: faker.datatype.number({
      max: 300,
      min: 50,
    }),
    repetitions: faker.datatype.number({
      max: 20,
      min: 2,
    }),
  });

  return data;
};

export const deleteAllTestSets = async () => {
  const query = `DELETE FROM sets`;
  await db.query(query);
};
