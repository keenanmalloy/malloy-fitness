// setting_id bigserial PRIMARY KEY,
// updated_at timestamp with time zone DEFAULT now() NOT NULL,
// account_id bigint,
// unit_preference text DEFAULT 'imperial', -- imperial | metric
// appearance text DEFAULT 'light', -- light | dark

// -- goals
// daily_steps_goal int,
// weekly_cardio_minutes_goal int,
// body_weight_goal int

import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { startSessionMutation } from 'controllers/sessions/startSessionMutation';
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
