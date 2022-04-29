import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { addMuscleGroupToExercise } from 'controllers/addMuscleGroupToExercise';
import { removeMuscleGroupFromExercise } from 'controllers/removeMuscleGroupFromExercise';

const router = Router();

// Add muscle-group to the exercise
router.post(
  '/:exerciseId/muscle-group/',
  authenticate,
  authorize,
  async (req, res) => {
    await addMuscleGroupToExercise(res, req.body, req.params.exerciseId);
  }
);

// Remove primary muscle-group from the exercise
router.delete(
  '/:exerciseId/muscle-group/:muscleGroupId/primary',
  authenticate,
  authorize,
  async (req, res) => {
    await removeMuscleGroupFromExercise(
      res,
      req.params.exerciseId,
      req.params.muscleGroupId,
      'primary'
    );
  }
);

// Remove secondary muscle-group from the exercise
router.delete(
  '/:exerciseId/muscle-group/:muscleGroupId/secondary',
  authenticate,
  authorize,
  async (req, res) => {
    await removeMuscleGroupFromExercise(
      res,
      req.params.exerciseId,
      req.params.muscleGroupId,
      'secondary'
    );
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
