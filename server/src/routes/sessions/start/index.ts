import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { startSessionMutation } from 'controllers/sessions/startSessionMutation';

const router = Router();

// Start workout
router.patch('/:sessionId/start', authenticate, authorize, async (req, res) => {
  await startSessionMutation(res, req.params.sessionId);
});

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
