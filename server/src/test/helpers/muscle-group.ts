import { faker } from '@faker-js/faker';
import { createMuscleGroup } from 'queries/muscle-groups';

interface CreateMuscleGroup {
  name: string;
  description: string;
  image: string;
}

export const createTestMuscleGroup = async (overrides?: CreateMuscleGroup) => {
  const muscleGroup = await createMuscleGroup({
    name: overrides?.name || faker.random.word(),
    description: overrides?.description || faker.lorem.sentence(),
    image: overrides?.image || faker.image.imageUrl(),
  });
  return muscleGroup;
};
