import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { continueSession } from 'controllers/sessions/continueSession';

const router = Router();

// Continue session
router.get(
  '/:sessionId/continue',
  authenticate,
  authorize,
  async (req, res) => {
    await continueSession(res, req.params.sessionId);
  }
);

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
