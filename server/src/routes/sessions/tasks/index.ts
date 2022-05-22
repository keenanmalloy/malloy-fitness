import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { retrieveTask } from 'controllers/tasks/retrieveTask';
import { removeTask } from 'controllers/tasks/removeTask';
import { addTaskToSession } from 'controllers/tasks/addTaskToSession';

const router = Router();

// Get task in the session
router.get(
  '/:sessionId/tasks/:workoutTaskId',
  authenticate,
  authorize,
  async (req, res) => {
    await retrieveTask(res, req.params.sessionId, req.params.workoutTaskId);
  }
);

// Add task to the session
router.post('/:sessionId/tasks', authenticate, authorize, async (req, res) => {
  await addTaskToSession(res, req.params.sessionId, req.body);
});

// Remove task in the session
router.delete(
  '/:sessionId/tasks/:workoutTaskId',
  authenticate,
  authorize,
  async (req, res) => {
    await removeTask(
      res,
      req.params.sessionId,
      req.params.workoutTaskId,
      req.query.workoutId as string
    );
  }
);

// Remove task in the session
router.delete(
  '/:sessionId/tasks/:workoutTaskId',
  authenticate,
  authorize,
  async (req, res) => {
    await removeTask(
      res,
      req.params.sessionId,
      req.params.workoutTaskId,
      req.query.workoutId as string
    );
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
