import { faker } from '@faker-js/faker';
import { db } from 'config/db';
import { createMuscleGroup } from 'queries/muscle-groups';

interface CreateMuscleGroup {
  name: string;
  description: string;
  image: string;
}

export const createTestMuscleGroup = async (overrides?: CreateMuscleGroup) => {
  const muscleGroup = await createMuscleGroup({
    name: faker.random.word(),
    description: faker.lorem.sentence(),
    image: faker.image.imageUrl(),
    ...overrides,
  });
  return muscleGroup;
};

export const connectMuscleGroupToExercise = async (
  exerciseId: string,
  muscleGroupId: string
) => {
  await db.query(
    `INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, "group") VALUES ($1, $2, $3)`,
    [exerciseId, muscleGroupId, 'primary']
  );
};
