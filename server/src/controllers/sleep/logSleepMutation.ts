import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';

const createSleepSchema = Joi.object({
  duration: Joi.number().max(24).required(),
  rating: Joi.number().max(5).required(),
  quality: Joi.number().max(100).allow(null).optional(),
});

interface Data {
  duration: number;
  rating: number;
  quality: number;
}

export const logSleepMutation = async (res: Response, data: Data) => {
  const { error, value, warning } = createSleepSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      sleep: value,
      error: error,
    });
  } else {
    const { duration, rating, quality } = data;

    const query = `
        WITH 
          data(duration, rating, quality, account_id) AS (
            VALUES                           
                (${duration}, ${rating}, ${quality}, ${res.locals.state.account.account_id})
            )
          INSERT INTO sleep (duration, rating, quality, account_id)
            SELECT duration, rating, quality, account_id
              FROM data
            RETURNING *
        `;

    try {
      const data = await db.query(query);

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Sleep logged successfully',
        sleep: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        sleep: null,
      });
    }
  }
};
