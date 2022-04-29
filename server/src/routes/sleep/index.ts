import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { logSleepMutation } from 'controllers/sleep/logSleepMutation';

const router = Router();

// Log sleep
router.post('/', authenticate, async (req, res) => {
  await logSleepMutation(res, req.body);
});

export default (parentRouter: Router) => {
  parentRouter.use('/sleep', router);
};
