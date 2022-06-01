import { createSession } from 'queries/sessions';
import { createTestWorkout } from './workout';

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
