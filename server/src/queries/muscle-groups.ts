import { db } from 'config/db';
import {
  exercise_muscle_groups_table,
  muscle_groups_table,
} from 'utils/databaseTypes';

export const getMuscleGroups = async (exerciseId: string) => {
  const data = await db.query<
    Required<
      Pick<muscle_groups_table, 'name' | 'description' | 'muscle_group_id'> &
        Pick<exercise_muscle_groups_table, 'group'>
    >
  >(
    `SELECT
          mg.name,
          mg.description,
          mg.muscle_group_id,
          "group" as group
        FROM muscle_groups mg
        JOIN exercise_muscle_groups emg ON emg.muscle_group_id = mg.muscle_group_id
      WHERE exercise_id = $1`,
    [exerciseId]
  );

  return data.rows;
};

export const createExerciseMuscleGroups = async (
  exerciseId: string,
  primary: string[],
  secondary: string[]
) => {
  const preparePrimaryValues = () => {
    if (secondary.length) {
      return `${primary
        .map((id) => `(${exerciseId}, ${id}, 'primary')`)
        .join(',')},`;
    }
    return primary.map((id) => `(${exerciseId}, ${id}, 'primary')`).join(',');
  };

  const prepareSecondaryValues = () => {
    return secondary
      .map((id) => `(${exerciseId}, ${id}, 'secondary')`)
      .join(',');
  };

  const data = await db.query<
    Pick<
      exercise_muscle_groups_table,
      'exercise_id' | 'group' | 'muscle_group_id'
    >
  >(`
    WITH     
    data(exercise_id, muscle_group_id, "group") AS (
      VALUES 
        ${preparePrimaryValues()}
        ${prepareSecondaryValues()}
      )
    INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, "group")
      SELECT exercise_id, muscle_group_id, "group"
        FROM data
      RETURNING *
    `);

  return data.rows;
};

interface CreateMuscleGroup {
  name: string;
  description: string;
  image: string;
}

export const createMuscleGroup = async ({
  name,
  description,
  image,
}: CreateMuscleGroup) => {
  const query = `
  WITH 
    data(name, description, image) AS (
      VALUES                           
          ('${name}', '${description}', '${image}')
      )
    INSERT INTO muscle_groups (name, description, image)
      SELECT name, description, image
        FROM data
      RETURNING *
  `;

  const data = await db.query<muscle_groups_table>(query);
  return data.rows[0];
};
