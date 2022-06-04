import { faker } from '@faker-js/faker';
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
