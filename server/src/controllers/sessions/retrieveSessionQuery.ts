import { Response } from 'express';
import { fetchSessionExercises } from 'queries/sessionExercises';
import { querySessionById } from 'queries/sessions';

export const retrieveSessionQuery = async (res: Response, id: string) => {
  try {
    const data = await querySessionById(id);
    const taskExercises = await fetchSessionExercises(id);

    const mappedTasks =
      data.task_order &&
      data.task_order.map((taskId: string) => {
        const exercises = taskExercises.filter(
          (t) => t.workout_task_id === taskId
        );

        return {
          workout_task_id: taskId,
          exercises: exercises.map((t) => {
            return {
              exercise_id: t.exercise_id,
              name: t.name,
              repetitions: t.repetitions,
              reps_in_reserve: t.reps_in_reserve,
              rest_period: t.rest_period,
              workout_task_id: t.workout_task_id,
              workout_task_exercise_id: t.workout_task_exercise_id,
            };
          }),
        };
      });

    const session = {
      ...data,
      tasks: mappedTasks,
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
