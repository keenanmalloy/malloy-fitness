import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { cloneWorkoutMutation } from 'queries/cloneWorkoutMutation';
import { createStrengthWorkoutMutation } from 'queries/workouts/createStrengthWorkoutMutation';
import { deleteWorkoutMutation } from 'queries/deleteWorkoutMutation';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { retrieveWorkoutsQuery } from 'queries/retrieveWorkoutsQuery';
import { updateWorkoutMutation } from 'queries/updateWorkoutMutation';

import setsRouter from './sets';
import exercisesRouter from './exercises';
import startWorkoutRouter from './start';
import endWorkoutRouter from './end';
import { cloneScheduleWorkoutMutation } from 'queries/cloneScheduleMutation';
import { createRestWorkoutMutation } from 'queries/workouts/createRestWorkoutMutation';
import { createDeloadWorkoutMutation } from 'queries/workouts/createDeloadWorkoutMutation';
import { createCardioWorkoutMutation } from 'queries/workouts/createCardioWorkoutMutation';
import { createTherapyWorkoutMutation } from 'queries/workouts/createTherapyWorkoutMutation';

const router = Router();

// Retrieve all workouts (LIMIT 20) -------- /
// Retrieve todays workout(s) -------------- /?date=today
// Retrieve yesterdays workout(s) ---------- /?date=yesterday
// Retrieve tomorrows workout(s) ----------- /?date=tomorrow
// Retrieve future workout(s) -------------- /?date=future
// Retrieve workout(s) at a specific date -- /?date=YYYY-MM-DD
// Retrieve workout(s) by category --------- /?category=legs
// Retrieve workout(s) by type ------------- /?type=strength
// Retrieve workout(s) by activtiy --------- /?activity=in-progress (in-progress, completed, scheduled, default)
// Retrieve workout(s) by completed true --- /?complete=1
// Retrieve workout(s) by completed false -- /?complete=0
// Retrieve workout(s) sorted by ----------- /?sortBy=created-asc (created-asc, created-desc, updated-asc, updated-descm scheduled-asc, scheduled-desc)
router.get('/', authenticate, async (req, res) => {
  await retrieveWorkoutsQuery(req, res);
});

// Retrieve workout
router.get('/:workoutId', authenticate, authorize, async (req, res) => {
  await retrieveWorkoutQuery(res, req.params.workoutId);
});

// Create new workout ----- /?type=cardio
router.post('/', authenticate, authorize, async (req, res) => {
  // 'strength', 'rest', 'deload', 'cardio', 'therapy'
  switch (req.query.type) {
    case 'strength':
      return await createStrengthWorkoutMutation(res, req.body);
    case 'rest':
      return await createRestWorkoutMutation(res);
    case 'deload':
      return await createDeloadWorkoutMutation(res, req.body);
    case 'cardio':
      return await createCardioWorkoutMutation(res);
    case 'therapy':
      return await createTherapyWorkoutMutation(res, req.body);
    default:
      return await createStrengthWorkoutMutation(res, req.body);
  }
});

// Clone OR schedule workout ------------ /
// Schedule todays workout -------------- /?date=today
// Schedule tomorrows workout ----------- /?date=tomorrow
// Schedule workout at a specific date -- /?date=YYYY-MM-DD
router.post('/:workoutId/copy', authenticate, async (req, res) => {
  if (!!req.query.date) {
    await cloneScheduleWorkoutMutation(
      res,
      req.params.workoutId,
      req.query.date as string
    );
  } else {
    await cloneWorkoutMutation(res, req.params.workoutId);
  }
});

// Delete workout
router.delete('/:workoutId', authenticate, authorize, async (req, res) => {
  await deleteWorkoutMutation(res, req.params.workoutId);
});

// Update workout
router.put('/:workoutId', authenticate, authorize, async (req, res) => {
  await updateWorkoutMutation(res, req.body, req.params.workoutId);
});

setsRouter(router);
exercisesRouter(router);
startWorkoutRouter(router);
endWorkoutRouter(router);

export default (parentRouter: Router) => {
  parentRouter.use('/workouts', router);
};
