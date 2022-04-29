import { db } from 'config/db';
import { Response } from 'express';

export const createCardioWorkoutMutation = async (res: Response) => {
  const accountId = res.locals.state.account.account_id;

  const query = `
      WITH 
        data(name, description, category, created_by, type) AS (
          VALUES                           
              ('rest', null, null, ${accountId}, 'cardio')
          )
        INSERT INTO workouts (name, description, category, created_by, type)
          SELECT name, description, category, created_by, type
            FROM data
          RETURNING *
      `;

  try {
    const data = await db.query(query);
    const workout = data.rows[0];

    return res.status(201).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Cardio workout created successfully',
      workout,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      //@ts-ignore
      message: error && error.message ? error.message : 'Database error',
      workout: null,
      error: error,
    });
  }
};
