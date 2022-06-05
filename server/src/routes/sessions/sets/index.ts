import { createSetMutation } from 'controllers/sets/createSetMutation';
import { deleteSetMutation } from 'controllers/sets/deleteSetMutation';
import { deleteSetsByExerciseMutation } from 'controllers/sets/deleteSetsByExerciseMutation';
import { retrieveSetsByExerciseQuery } from 'controllers/sets/retrieveSetsByExerciseQuery';
import { retrieveSetsQuery } from 'controllers/sets/retrieveSetsQuery';
import { updateSetMutation } from 'controllers/sets/updateSetMutation';
import { Router } from 'express';

import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';

const router = Router();

// Retrieve all sets by session
router.get('/:sessionId/sets', authenticate, authorize, async (req, res) => {
  await retrieveSetsQuery(res, req.params.sessionId);
});

// Retrieve all sets by session by exercise
router.get(
  '/:sessionId/exercise/:exerciseId/sets',
  authenticate,
  authorize,
  async (req, res) => {
    await retrieveSetsByExerciseQuery(
      res,
      req.params.sessionId,
      req.params.exerciseId
    );
  }
);

// Create new set
router.post('/:sessionId/sets', authenticate, authorize, async (req, res) => {
  await createSetMutation(res, req.body, req.params.sessionId);
});

// Delete set
router.delete(
  '/:sessionId/sets/:setId',
  authenticate,
  authorize,
  async (req, res) => {
    await deleteSetMutation(res, req.params.setId);
  }
);

// Delete sets by session by exercise
router.delete(
  '/:sessionId/exercise/:exerciseId/sets',
  authenticate,
  authorize,
  async (req, res) => {
    await deleteSetsByExerciseMutation(
      res,
      req.params.sessionId,
      req.params.exerciseId
    );
  }
);

// Update set
router.put(
  '/:sessionId/sets/:setId',
  authenticate,
  authorize,
  async (req, res) => {
    await updateSetMutation(res, req.body, req.params.setId);
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
