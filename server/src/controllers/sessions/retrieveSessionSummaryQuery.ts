import { Response } from 'express';
import { queryExercisesBySession } from 'queries/sessionExercises';
import { querySessionWorkoutById } from 'queries/sessions';
import { querySetsBySession } from 'queries/sets';

export const retrieveSessionSummaryQuery = async (
  res: Response,
  id: string
) => {
  try {
    const sessionData = await querySessionWorkoutById(id);
    const tasks = await queryExercisesBySession(id);
    const sets = await querySetsBySession(id);

    const hasExercises = !!tasks[0].exercise_id;
    const hasSets = !!sets[0].set_id;

    const mappedTasks =
      sessionData.task_order &&
      sessionData.task_order.map((taskId: string) => {
        const exercises = tasks.filter((t) => t.workout_task_id === taskId);
        return {
          workout_task_id: taskId,
          exercises: exercises.map((t) => {
            return {
              exercise_id: t.exercise_id,
              name: t.name,
              video: t.video,
              primary_tracker: t.primary_tracker,
              secondary_tracker: t.secondary_tracker,
              workout_task_id: t.workout_task_id,
              workout_task_exercise_id: t.workout_task_exercise_id,
              sets: !hasSets
                ? []
                : sets
                    .filter((set) => set.exercise_id === t.exercise_id)
                    .map((set) => {
                      return {
                        set_id: set.set_id,
                        repetitions: set.repetitions,
                        weight: set.weight,
                      };
                    }),
            };
          }),
        };
      });

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
      task_order: sessionData.task_order,
      tasks: !hasExercises ? [] : mappedTasks,
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
