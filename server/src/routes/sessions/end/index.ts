import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { endSessionMutation } from 'queries/sessions/endSessionMutation';

const router = Router();

// End session
router.patch('/:sessionId/end', authenticate, authorize, async (req, res) => {
  await endSessionMutation(res, req.params.sessionId);
});

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
