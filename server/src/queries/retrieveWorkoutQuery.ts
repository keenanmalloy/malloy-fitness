import { db } from 'config/db';

interface Response {
  status: string;
  message: string;
  workout: any;
}

export const retrieveWorkoutQuery = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `SELECT 
  workouts.name as workout_name,
  workouts.description as workout_description,
  workouts.category as workout_category,
  workouts.created_by as workout_created_by,
  workouts.workout_id,
  workouts.started_at,
  workouts.ended_at,
  workouts.type,
  workouts.workout_dt,
  workouts.completed,
  e.name,
  e.description,
  e.category,
  e.video,
  e.profile,
  e.exercise_id,
  we.priority,
  we.order,
  we.notes,
  we.sets,
  we.repetitions,
  we.reps_in_reserve,
  we.rest_period
FROM workouts
LEFT OUTER JOIN workout_exercises we on workouts.workout_id = we.workout_id
LEFT OUTER JOIN exercises e on we.exercise_id = e.exercise_id
WHERE workouts.workout_id = $1`;
  const params = [id];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Workout does not exist',
        workout: null,
      });
    }

    // Because of the LEFT OUTER JOIN, we return a single exercise with a null id.
    // Check if it exists and return an empty array if it does not.
    const exercises = !data.rows[0].exercise_id
      ? []
      : data.rows.map((exercise) => {
          return {
            name: exercise.name,
            description: exercise.description,
            exercise_id: exercise.exercise_id,
            category: exercise.category,
            profile: exercise.profile,
            video: exercise.video,
            order: exercise.order,
            priority: exercise.priority,
            notes: exercise.notes,
            sets: exercise.sets,
            repetitions: exercise.repetitions,
            repsInReserve: exercise.reps_in_reserve,
            restPeriod: exercise.rest_period,
          };
        });

    const workout = {
      name: data.rows[0].workout_name,
      description: data.rows[0].workout_description,
      category: data.rows[0].workout_category,
      workout_id: data.rows[0].workout_id,
      workout_dt: data.rows[0].workout_dt,
      started_at: data.rows[0].started_at,
      ended_at: data.rows[0].ended_at,
      type: data.rows[0].type,
      completed: data.rows[0].completed,
      exercises,
    };

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Workout fetched successfully',
      workout,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      workout: null,
    });
  }
};
