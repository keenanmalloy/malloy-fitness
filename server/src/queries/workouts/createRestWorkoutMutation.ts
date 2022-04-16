import { db } from 'config/db';
import { Response } from 'express';

export const createRestWorkoutMutation = async (res: Response) => {
  const accountId = res.locals.state.account.account_id;

  const query = `
      WITH 
        data(name, description, category, created_by, type) AS (
          VALUES                           
              ('rest day', null, null, ${accountId}, 'rest')
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
      status: 'success',
      message: 'Rest created successfully',
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
