import { Response } from 'express';
import {
  ExerciseType,
  getExerciseWithMuscleGroups,
  getRelatedExercises,
} from 'queries/exercises';
import {
  doesWorkoutHaveSessions,
  updateSessionWorkout,
} from 'queries/sessions';
import { cloneWorkoutTasksWithExercises } from 'queries/workoutTasks';
import {
  createTaskExercise,
  updateTaskExercise,
} from 'queries/workoutTaskExercises';
import { cloneWorkout, retrieveWorkoutQuery } from 'queries/workouts';

export const rotateTaskExercise = async (
  res: Response,
  sessionId: string,
  currentExerciseId: string,
  body: {
    workoutId: string;
    workoutTaskId: string;
    workoutTaskExerciseId: string;
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workoutId;
  const workoutTaskExerciseId = body.workoutTaskExerciseId;

  try {
    const { hasSessions, sessionCount } = await doesWorkoutHaveSessions(
      workoutId
    );

    if (hasSessions && sessionCount > 1) {
      console.warn('WORKOUT ALREADY HAS SESSIONS - NEED TO CLONE', {
        need_to_clone: sessionCount > 1,
      });

      const data = await onRelatedExerciseChangeClone({
        workoutId,
        accountId,
        currentExerciseId,
        workoutTaskExerciseId,
        sessionId,
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and changed exercise in session.',
        status: 'success',
        exerciseId: data,
      });
    }

    console.warn('REPLACING EXERCISE IN SESSION');
    const newExerciseId = await onRelatedExerciseChangeSwap({
      workoutId,
      accountId,
      currentExerciseId,
      workoutTaskExerciseId,
      sessionId,
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Successfully changed exercise in session.',
      status: 'success',
      exerciseId: newExerciseId,
    });
  } catch (error) {
    const errorMessage = (error as unknown as { message: string })?.message;
    return res.status(500).json({
      error: 'Something went wrong',
      message: errorMessage,
    });
  }
};

interface CloneMutationParams {
  workoutId: string;
  accountId: string;
  currentExerciseId: string;
  workoutTaskExerciseId: string;
  sessionId: string;
}

const onRelatedExerciseChangeClone = async ({
  workoutId,
  accountId,
  currentExerciseId,
  workoutTaskExerciseId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');
  const currentExerciseData = await getExerciseWithMuscleGroups({
    exerciseId: currentExerciseId,
    accountId,
  });

  const relatedExercises = await getRelatedExercises({
    accountId: accountId,
    categoryQuery: currentExerciseData.category,
    exerciseIdQuery: currentExerciseData.exercise_id,
    mgIds: [
      ...currentExerciseData.primary.map(
        (mg: { muscle_group_id: any }) => mg.muscle_group_id
      ),
      ...currentExerciseData.secondary.map(
        (mg: { muscle_group_id: any }) => mg.muscle_group_id
      ),
    ],
    profileQuery: currentExerciseData.profile,
    type: currentExerciseData.type as ExerciseType,
  });

  const oldExerciseIds = oldWorkout.tasks.map((task) => task.exercise_id);

  // Filter out exercises that are already in the workout so we don't add duplicates
  const filteredRelatedExercises = relatedExercises.rows.filter(
    (re) => !oldExerciseIds.includes(re.exercise_id)
  );

  const rowLength = filteredRelatedExercises.length;
  if (!rowLength) throw new Error('No related exercises found');

  const randomRelatedExercise =
    filteredRelatedExercises[Math.floor(Math.random() * rowLength)];

  // get workout exercise with id
  const workoutTaskExercise = oldWorkout.tasks.find(
    (task) => task.exercise_id === currentExerciseId
  );
  if (!workoutTaskExercise) throw new Error('Exercise not found');

  const { newWorkoutId } = await cloneWorkout({
    accountId,
    workoutId,
  });

  if (!oldWorkout.tasks.length) {
    return newWorkoutId;
  }

  const mappedTasks = oldWorkout.task_order.map((taskId) => {
    const exercises = oldWorkout.tasks.filter(
      (t) => t.workout_task_id === taskId
    );
    return {
      workout_task_id: taskId,
      exercises: exercises.map((t) => {
        return {
          exercise_id: t.exercise_id,
          sets: t.sets,
          repetitions: t.repetitions,
          reps_in_reserve: t.reps_in_reserve,
          rest_period: t.rest_period,
        };
      }),
    };
  });

  await cloneWorkoutTasksWithExercises({
    newWorkoutId,
    payload: [...mappedTasks],
  });

  await createTaskExercise({
    exercise_id: randomRelatedExercise.exercise_id,
    workout_task_id: workoutTaskExercise.workout_task_id,
    workout_id: newWorkoutId,
  });

  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  return randomRelatedExercise.exercise_id;
};

const onRelatedExerciseChangeSwap = async ({
  workoutId,
  accountId,
  currentExerciseId,
  workoutTaskExerciseId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');

  const currentExerciseData = await getExerciseWithMuscleGroups({
    exerciseId: currentExerciseId,
    accountId,
  });

  const relatedExercises = await getRelatedExercises({
    accountId,
    categoryQuery: currentExerciseData.category,
    exerciseIdQuery: currentExerciseData.exercise_id,
    mgIds: [
      ...currentExerciseData.primary.map(
        (mg: { muscle_group_id: any }) => mg.muscle_group_id
      ),
      ...currentExerciseData.secondary.map(
        (mg: { muscle_group_id: any }) => mg.muscle_group_id
      ),
    ],
    profileQuery: currentExerciseData.profile,
    type: currentExerciseData.type as ExerciseType,
  });

  const oldExerciseIds = oldWorkout.tasks.map((task) => task.exercise_id);

  // Filter out exercises that are already in the workout so we don't add duplicates
  const filteredRelatedExercises = relatedExercises.rows.filter(
    (re) => !oldExerciseIds.includes(re.exercise_id)
  );

  const rowLength = filteredRelatedExercises.length;
  if (!rowLength) throw new Error('No related exercises found');

  const randomRelatedExercise =
    filteredRelatedExercises[Math.floor(Math.random() * rowLength)];

  if (!oldWorkout) throw new Error('Workout not found');

  // get workout exercise with id
  const workoutTaskExercise = oldWorkout.tasks.find(
    (task) => task.exercise_id === currentExerciseId
  );
  if (!workoutTaskExercise || !workoutTaskExercise.workout_task_exercise_id)
    throw new Error('Exercise not found');
  if (!randomRelatedExercise.exercise_id)
    throw new Error('No related exercise found');

  await updateTaskExercise({
    exercise_id: randomRelatedExercise.exercise_id,
    workout_task_exercise_id: workoutTaskExercise.workout_task_exercise_id,
  });
};
