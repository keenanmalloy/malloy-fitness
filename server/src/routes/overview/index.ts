import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { retrieveDailyOverviewQuery } from 'controllers/overview/retrieveDailyOverviewQuery';

const router = Router();

// Get Daily Overview
// -------- /?date=2019-01-01
router.get('/', authenticate, async (req, res) => {
  await retrieveDailyOverviewQuery(req, res);
});

export default (parentRouter: Router) => {
  parentRouter.use('/overview', router);
};
