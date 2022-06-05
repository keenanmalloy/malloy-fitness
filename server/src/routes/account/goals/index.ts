import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { fetchGoalsQuery } from 'controllers/account/fetchGoals';
import { updateGoalsMutation } from 'controllers/account/updateGoals';

const router = Router();

// Update goals
router.patch('/', authenticate, async (req, res) => {
  await updateGoalsMutation(res, req.body);
});

// fetching goals
router.get('/', authenticate, async (req, res) => {
  await fetchGoalsQuery(res);
});

export default (parentRouter: Router) => {
  parentRouter.use('/goals', router);
};
