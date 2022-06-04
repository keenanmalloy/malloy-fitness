import { createSession } from 'queries/sessions';
import { createTestSet } from './sets';
import { createFullTestWorkout } from './workout';

interface SessionOverrides {
  sessionDt?: string;
  workoutId?: string;
}

export const createTestSession = async (
  accountId: string,
  overrides?: SessionOverrides
) => {
  const { workoutId, exerciseIds, workoutTaskIds, workout } =
    await createFullTestWorkout(accountId);
  const data = await createSession({
    workoutId,
    accountId,
    sessionDt: 'today',
    ...overrides,
  });

  return { ...data, exerciseIds, workoutTaskIds, workout };
};

export const createTestSessionWithSets = async (
  accountId: string,
  overrides?: SessionOverrides
) => {
  const { workoutId, exerciseIds } = await createFullTestWorkout(accountId);
  const data = await createSession({
    workoutId,
    accountId,
    sessionDt: 'today',
    ...overrides,
  });

  const sets = await Promise.all([
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

  const setIds = sets.map((set) => set.set_id);

  return { ...data, exerciseIds, setIds };
};

export const createTestSessionOnWorkout = async (
  workoutId: string,
  accountId: string,
  overrides?: SessionOverrides
) => {
  const data = await createSession({
    workoutId,
    accountId,
    sessionDt: 'today',
    ...overrides,
  });

  return { ...data };
};
