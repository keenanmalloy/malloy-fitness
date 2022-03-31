import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { addExerciseToWorkoutMutation } from 'queries/addExerciseToWorkoutMutation';
import { removeExerciseFromWorkoutMutation } from 'queries/removeExerciseFromWorkoutMutation';
import { retrieveExerciseWorkoutQuery } from 'queries/retrieveExerciseWorkoutQuery';
import { updateWorkoutExerciseMutation } from 'queries/updateWorkoutExerciseMutation';

const router = Router();

// Get exercise in the workout
router.get(
  '/:workoutId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await retrieveExerciseWorkoutQuery(
      res,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);

// Remove exercise in the workout
router.delete(
  '/:workoutId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await removeExerciseFromWorkoutMutation(
      res,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);

// Update exercise in the workout
router.put(
  '/:workoutId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await updateWorkoutExerciseMutation(
      res,
      req.body,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);

// Add exercise to the workout
router.post(
  '/:workoutId/exercises/',
  authenticate,
  authorize,
  async (req, res) => {
    await addExerciseToWorkoutMutation(res, req.body, req.params.workoutId);
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
