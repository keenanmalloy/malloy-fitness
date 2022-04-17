import { db } from 'config/db';

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any;
}

export const deleteExerciseMutation = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `DELETE FROM exercises WHERE exercise_id = $1 RETURNING *;`;
  const params = [id];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Exercise does not exist',
        exercise: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Exercise deleted successfully',
      exercise: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercise: null,
    });
  }
};
