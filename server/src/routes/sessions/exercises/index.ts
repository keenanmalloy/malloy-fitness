import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { rotateSessionExercise } from 'controllers/rotateSessionExercise';
import { retrieveExerciseSessionQuery } from 'controllers/sessions/retrieveExerciseSessionQuery';

const router = Router();

// Get exercise in the session
router.get(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await retrieveExerciseSessionQuery(
      res,
      req.params.sessionId,
      req.params.exerciseId
    );
  }
);

// Rotate exercise in the session
router.put(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await rotateSessionExercise(
      res,
      req.params.sessionId,
      req.params.exerciseId,
      req.body
    );
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
