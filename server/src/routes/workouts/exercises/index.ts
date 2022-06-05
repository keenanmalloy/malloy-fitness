import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { updateWorkoutExerciseMetadataMutation } from 'controllers/updateWorkoutExerciseMetadataMutation';
import { addExerciseToWorkoutMutation } from 'controllers/workouts/addExerciseToWorkoutMutation';
import { removeExerciseFromWorkoutMutation } from 'controllers/workouts/removeExerciseFromWorkoutMutation';

const router = Router();

// Remove exercise in the workout
router.delete(
  '/:workoutId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await removeExerciseFromWorkoutMutation(res, req.params.exerciseId);
  }
);

// Update exercise metadata in the workout
router.patch(
  '/:workoutId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    console.log('this should be hit');
    await updateWorkoutExerciseMetadataMutation(
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
