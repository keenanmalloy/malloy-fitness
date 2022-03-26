import { db } from "config/db";
import { Response, Request } from "express";

// https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
function getUniqueListBy(arr: any, key: string) {
  return [
    ...new Map(
      arr.map((item: { [x: string]: any }) => [item[key], item])
    ).values(),
  ];
}

export const retrieveExercisesQuery = async (req: Request, res: Response) => {
  const query = !!req.query.q
    ? `SELECT
      e.name,
      e.exercise_id,
      e.profile,
      e.category,
      e.created_by,
      e.description,
      mg.muscle_group_id,
      mg.name AS muscle_group_name,
      mg.description AS muscle_group_description,
      "group" AS muscle_group

    FROM muscle_groups mg
      JOIN exercise_muscle_groups emg
          on mg.muscle_group_id = emg.muscle_group_id
              JOIN exercises e on e.exercise_id = emg.exercise_id
    
    WHERE e.name 
      LIKE '%${req.query.q}%' 
      OR mg.name LIKE '%${req.query.q}%' 
      OR mg.description LIKE '%${req.query.q}%'

    LIMIT 10`
    : `SELECT
      e.name,
      e.exercise_id,
      e.profile,
      e.category,
      e.created_by,
      e.description,
      mg.muscle_group_id,
      mg.name AS muscle_group_name,
      mg.description AS muscle_group_description,
      "group" AS muscle_group

    FROM muscle_groups mg
      JOIN exercise_muscle_groups emg
          on mg.muscle_group_id = emg.muscle_group_id
              JOIN exercises e on e.exercise_id = emg.exercise_id
    
    LIMIT 10`;

  try {
    const data = await db.query(query);
    const exercises = getUniqueListBy(
      data.rows.map(
        ({ name, exercise_id, profile, category, created_by, description }) => {
          return {
            name,
            exercise_id,
            profile,
            category,
            created_by,
            description,
          };
        }
      ),
      "exercise_id"
    );

    return res.status(200).json({
      message: "Exercises fetched successfully",
      status: "success",
      exercises,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: "error",
      message: "Database error",
      exercise: null,
    });
  }
};
