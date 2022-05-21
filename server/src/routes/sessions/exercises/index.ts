import { changeTaskExercise } from 'controllers/tasks/changeTaskExercise';
import { removeTaskExercise } from 'controllers/tasks/removeTaskExercise';
import { rotateTaskExercise } from 'controllers/tasks/rotateTaskExercise';
import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

const router = Router();

// Rotate to a related exercise in the session
router.put(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await rotateTaskExercise(
      res,
      req.params.sessionId,
      req.params.exerciseId,
      req.body
    );
  }
);

// Change exercise in the session by selection
router.post(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await changeTaskExercise(
      res,
      req.params.sessionId,
      req.params.exerciseId,
      req.body
    );
  }
);

// Remove exercise in the session
router.delete(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await removeTaskExercise(
      res,
      req.params.sessionId,
      req.params.exerciseId,
      req.query.workoutId as string,
      req.query.workoutTaskId as string
    );
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
