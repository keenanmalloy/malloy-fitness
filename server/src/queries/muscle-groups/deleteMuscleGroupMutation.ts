import { db } from 'config/db';
import { Response } from 'express';

export const deleteMuscleGroupMutation = async (res: Response, id: string) => {
  const query = `DELETE FROM muscle_groups WHERE muscle_group_id = $1 RETURNING *;`;
  const params = [id];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'muscle-group does not exist',
        muscleGroup: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'muscle-group deleted successfully',
      muscleGroup: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      muscleGroup: null,
    });
  }
};
