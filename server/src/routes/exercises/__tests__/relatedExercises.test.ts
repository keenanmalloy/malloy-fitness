import axios, { AxiosInstance } from 'axios';
import {
  EXERCISE_CATEGORIES,
  EXERCISE_PROFILES,
  EXERCISE_TYPES,
} from 'test/helpers/env';
import {
  createTestExercise,
  deleteAllTestExercises,
} from 'test/helpers/exercise';
import {
  connectMuscleGroupToExercise,
  createTestMuscleGroup,
} from 'test/helpers/muscle-group';
import { deleteAllTestSets } from 'test/helpers/sets';
import { createAndAuthorizeUser } from 'test/helpers/user';
import { initializeWebServer, stopWebServer } from 'test/server';
import { exercises_table, muscle_groups_table } from 'utils/databaseTypes';

describe('Related Exercises API', function () {
  let axiosAPIClient: AxiosInstance;
  let cookie: string;
  let accountId: string;
  let exercises: exercises_table[];
  let muscleGroups: muscle_groups_table[];

  beforeAll(async () => {
    const apiConnection = await initializeWebServer();
    const axiosConfig = {
      baseURL: `http://localhost:${apiConnection.port}`,
      validateStatus: () => true,
    };
    axiosAPIClient = axios.create(axiosConfig);
    const user = await createAndAuthorizeUser();
    cookie = user.cookie;
    accountId = user.accountId;
    await deleteAllTestSets();
    await deleteAllTestExercises();

    muscleGroups = await Promise.all([
      createTestMuscleGroup(),
      createTestMuscleGroup(),
      createTestMuscleGroup(),
    ]);

    exercises = await Promise.all([
      createTestExercise(accountId, {
        category: EXERCISE_CATEGORIES[0],
        profile: EXERCISE_PROFILES[0],
        name: 'AAA',
        description: '111',
        type: EXERCISE_TYPES[0],
      }),
      createTestExercise(accountId, {
        category: EXERCISE_CATEGORIES[0],
        profile: EXERCISE_PROFILES[0],
        name: 'BBB',
        description: '222',
        type: EXERCISE_TYPES[0],
      }),
      createTestExercise(accountId, {
        category: EXERCISE_CATEGORIES[0],
        profile: EXERCISE_PROFILES[0],
        name: 'CCC',
        description: '333',
        type: EXERCISE_TYPES[0],
      }),
    ]);

    await Promise.all([
      // first exercise
      connectMuscleGroupToExercise(
        exercises[0].exercise_id!,
        muscleGroups[0].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[0].exercise_id!,
        muscleGroups[1].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[0].exercise_id!,
        muscleGroups[2].muscle_group_id!
      ),
      //second exercise
      connectMuscleGroupToExercise(
        exercises[1].exercise_id!,
        muscleGroups[0].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[1].exercise_id!,
        muscleGroups[1].muscle_group_id!
      ),
      connectMuscleGroupToExercise(
        exercises[1].exercise_id!,
        muscleGroups[2].muscle_group_id!
      ),
    ]);
  });

  afterAll(async () => {
    await stopWebServer();
  });

  describe('Fetching related exercises', function () {
    it('responds with 401 if missing Cookie', async function () {
      const response = await axiosAPIClient.get('/exercises/');
      expect(response.status).toBe(401);
    });

    it('returns the only other related exercise', async function () {
      const response = await axiosAPIClient.get(
        `/exercises/?mgIds=${muscleGroups
          .map((g) => g.muscle_group_id)
          .join(',')}&type=${exercises[0].type}&profile=${
          exercises[0].profile
        }&category=${exercises[0].category}&exerciseId=${
          exercises[0].exercise_id
        }`,
        {
          headers: {
            Cookie: cookie,
          },
        }
      );

      const secondExercise = exercises[1];

      expect(response.status).toBe(200);
      expect(response.data.exercises[0]).toMatchObject({
        exercise_id: secondExercise.exercise_id,
        name: secondExercise.name,
      });
      expect(response.data.exercises.length).toBe(1);
    });
  });
});
