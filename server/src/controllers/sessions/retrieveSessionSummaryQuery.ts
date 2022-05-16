import { db } from 'config/db';
import { Response } from 'express';

export const retrieveSessionSummaryQuery = async (
  res: Response,
  id: string
) => {
  try {
    const sessionData = await querySessionWorkoutById(id);
    const exercises = await queryExercisesBySession(id);
    const sets = await querySetsBySession(id);

    const hasExercises = !!exercises[0].exercise_id;
    const hasSets = !!sets[0].set_id;

    const session = {
      name: sessionData.workout_name,
      category: sessionData.category,
      type: sessionData.type,
      session_id: sessionData.session_id,
      workout_id: sessionData.workout_id,
      started_at: sessionData.started_at,
      readiness_energy: sessionData.readiness_energy,
      readiness_mood: sessionData.readiness_mood,
      readiness_stress: sessionData.readiness_stress,
      readiness_soreness: sessionData.readiness_soreness,
      readiness_sleep: sessionData.readiness_sleep,
      ended_at: sessionData.ended_at,
      completed: sessionData.completed,
      exercise_order: sessionData.exercise_order,
      exercises: !hasExercises
        ? []
        : exercises.map((row) => {
            return {
              name: row.name,
              exercise_id: row.exercise_id,
              video: row.video,
              primary_tracker: row.primary_tracker,
              secondary_tracker: row.secondary_tracker,
              sets: !hasSets
                ? []
                : sets
                    .filter((set) => set.exercise_id === row.exercise_id)
                    .map((set) => {
                      return {
                        set_id: set.set_id,
                        set_order: set.set_order,
                        repetitions: set.repetitions,
                        weight: set.weight,
                      };
                    }),
            };
          }),
    };

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Session fetched successfully',
      session,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      session: null,
    });
  }
};

const querySessionWorkoutById = async (sessionId: string) => {
  const query = `
  SELECT
  sessions.session_id,
  sessions.workout_id,
  readiness_energy,
  readiness_mood,
  readiness_stress,
  readiness_soreness,
  readiness_sleep,
  started_at,
  ended_at,
  completed,
  workouts.name workout_name,
  workouts.category,
  workouts.exercise_order,
  workouts.type
FROM sessions
  LEFT JOIN workouts ON workouts.workout_id = sessions.workout_id
WHERE sessions.session_id = $1`;

  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rows[0];
};

const queryExercisesBySession = async (sessionId: string) => {
  const query = `
    SELECT
      e.exercise_id,
      e.name,
      e.video,
      primary_tracker,
      secondary_tracker
    FROM sessions
      LEFT JOIN workouts ON workouts.workout_id = sessions.workout_id
      LEFT JOIN workout_exercises ON workouts.workout_id = workout_exercises.workout_id
      LEFT JOIN exercises e on workout_exercises.exercise_id = e.exercise_id
    WHERE sessions.session_id = $1 ORDER BY workout_exercises.order ASC`;
  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rows;
};

const querySetsBySession = async (sessionId: string) => {
  const query = `
  SELECT 
      s.set_id,
      s.repetitions,
      s.weight,
      s.set_order,
      e.exercise_id
    FROM sessions
  LEFT JOIN sets s on s.session_id = sessions.session_id
  LEFT JOIN exercises e on s.exercise_id = e.exercise_id
  WHERE sessions.session_id = $1  
  ORDER BY s.set_order ASC
  `;
  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rows;
};
