import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  exercise: any;
}

const getMuscleGroups = async (exerciseId: string) => {
  const data = await db.query(
    `SELECT * FROM muscle_groups mg
    JOIN exercise_muscle_groups emg ON emg.muscle_group_id = mg.muscle_group_id
  WHERE exercise_id = $1`,
    [exerciseId]
  );

  return data.rows;
};

export const retrieveExerciseQuery = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `SELECT * FROM exercises WHERE exercise_id = $1`;
  const params = [id];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.status(404).json({
        status: "error",
        message: "Exercise does not exist",
        exercise: null,
      });
    }

    const exerciseId = data.rows[0].exercise_id;
    const muscleGroups = await getMuscleGroups(exerciseId);
    const exercise = {
      ...data.rows[0],
      primary: muscleGroups.filter((mg) => mg.group === "primary"),
      secondary: muscleGroups.filter((mg) => mg.group === "secondary"),
    };

    return res.status(200).json({
      status: "success",
      message: "Exercise fetched successfully",
      exercise,
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
