import { db } from 'config/db';
import { Response } from 'express';

export const retrieveMuscleGroupsQuery = async (res: Response) => {
  const query = `SELECT * FROM muscle_groups`;

  try {
    const data = await db.query(query);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Muscle groups fetched successfully',
      status: 'success',
      muscleGroups: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      muscleGroups: null,
    });
  }
};
