import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { rotateSessionExercise } from 'controllers/sessions/rotateSessionExercise';
import { retrieveExerciseSessionQuery } from 'controllers/sessions/retrieveExerciseSessionQuery';
import { changeSessionExercise } from 'controllers/sessions/changeSessionExercise';
import { addExerciseToSession } from 'controllers/sessions/addExerciseToSession';
import { removeExerciseInSession } from 'controllers/sessions/removeExerciseInSession';

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

// Rotate to a related exercise in the session
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

// Change exercise in the session by selection
router.post(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await changeSessionExercise(
      res,
      req.params.sessionId,
      req.params.exerciseId,
      req.body
    );
  }
);

// Add exercise to the session
router.post(
  '/:sessionId/exercises',
  authenticate,
  authorize,
  async (req, res) => {
    await addExerciseToSession(res, req.params.sessionId, req.body);
  }
);

// Remove exercise in the session
router.delete(
  '/:sessionId/exercises/:exerciseId',
  authenticate,
  authorize,
  async (req, res) => {
    await removeExerciseInSession(
      res,
      req.params.sessionId,
      req.params.exerciseId,
      req.query.workoutId as string
    );
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
