import Joi from 'joi';
import { Response } from 'express';
import { createWorkout, updateWorkoutTaskOrder } from 'queries/workouts';
import { createTasksAndTaskExercises } from 'queries/workoutTasks';

type Tasks = {
  id: string;
  exercises: {
    exercise_id: string;
    repetitions?: string | null;
    repsInReserve?: string | null;
    restPeriod?: string | null;
    sets?: string | null;
  }[];
}[];

interface createWorkout {
  name: string;
  description: string;
  category: string;
  created_by: string | number;
  tasks: Tasks;
  type: 'strength' | 'cardio' | 'therapy' | 'hypertrophy' | 'deload';
}

const createWorkoutSchema = Joi.object({
  name: Joi.string().max(64).required(),
  description: Joi.string().max(250).allow('').optional(),
  category: Joi.string()
    .valid(
      'full body',
      'pull',
      'push',
      'chest',
      'arms',
      'back',
      'legs',
      'shoulders'
    )
    .required(),
  type: Joi.string()
    .valid('strength', 'cardio', 'therapy', 'hypertrophy', 'deload')
    .required(),
  tasks: Joi.array().items(
    Joi.object().keys({
      id: Joi.any().required(),
      exercises: Joi.array().items(
        Joi.object().keys({
          exercise_id: Joi.any().required(),
          repetitions: Joi.any().optional().allow(null),
          repsInReserve: Joi.any().optional().allow(null),
          restPeriod: Joi.any().optional().allow(null),
          sets: Joi.any().optional().allow(null),
        })
      ),
    })
  ),
});

export const createWorkoutMutation = async (
  res: Response,
  data: createWorkout
) => {
  const { error, value, warning } = createWorkoutSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      workout: value,
      error: error,
    });
  } else {
    const { name, description, category, tasks, type } = data;
    const accountId = res.locals.state.account.account_id;

    const validateTasks = (tasks: Tasks) => {
      return tasks.find((task) => {
        if (!task || !task.exercises) return;
        return task.exercises.find((exercise) => {
          if (!exercise) return;
          return Number.isNaN(parseInt(exercise.exercise_id.toString()));
        });
      });
    };

    if (validateTasks(tasks)) {
      return res.status(400).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Invalid exercise IDs',
        tasks: tasks,
        workout: null,
      });
    }

    try {
      const workoutId = await createWorkout({
        name,
        description,
        category,
        accountId,
        type,
      });

      if (tasks && tasks.length) {
        const workoutTaskIds = await createTasksAndTaskExercises({
          workoutId,
          tasks,
        });

        await updateWorkoutTaskOrder({
          taskOrder: JSON.stringify(workoutTaskIds),
          workoutId,
        });
      }

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Workout created successfully',
        workoutId,
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
  }
};
