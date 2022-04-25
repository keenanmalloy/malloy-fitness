import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { retrieveExerciseSessionQuery } from 'queries/sessions/retrieveExerciseSessionQuery';

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

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
