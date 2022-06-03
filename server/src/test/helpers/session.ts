import { createSession } from 'queries/sessions';
import { createTestSet } from './sets';
import { createFullTestWorkout, createTestWorkout } from './workout';

interface SessionOverrides {
  date?: string;
  workoutId?: string;
}

export const createTestSession = async (
  accountId: string,
  overrides?: SessionOverrides
) => {
  const workoutId = await createTestWorkout(accountId);
  const data = await createSession({
    workoutId,
    accountId,
    sessionDt: overrides?.date || 'today',
  });

  return data;
};

export const createTestSessionWithSets = async (
  accountId: string,
  overrides?: SessionOverrides
) => {
  const { workoutId, exerciseIds } = await createFullTestWorkout(accountId);
  const data = await createSession({
    workoutId,
    accountId,
    sessionDt: overrides?.date || 'today',
  });

  await Promise.all([
    createTestSet({
      exerciseId: exerciseIds[0],
      sessionId: data.session_id,
    }),
    createTestSet({
      exerciseId: exerciseIds[0],
      sessionId: data.session_id,
    }),
    createTestSet({
      exerciseId: exerciseIds[0],
      sessionId: data.session_id,
    }),
  ]);

  return { ...data, exerciseIds };
};
