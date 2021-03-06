import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { cloneWorkoutMutation } from 'controllers/workouts/cloneWorkoutMutation';
import { deleteWorkoutMutation } from 'controllers/workouts/deleteWorkoutMutation';
import { retrieveWorkoutQuery } from 'controllers/workouts/retrieveWorkoutQuery';
import { retrieveWorkoutsQuery } from 'controllers/workouts/retrieveWorkoutsQuery';
import { updateWorkoutMutation } from 'controllers/workouts/updateWorkoutMutation';

import setsRouter from '../sessions/sets';
import exercisesRouter from '../workouts/exercises';

import { cloneScheduleWorkoutMutation } from 'controllers/workouts/cloneScheduleMutation';
import { createWorkoutMutation } from 'controllers/workouts/createWorkoutMutation';

const router = Router();

// Retrieve all workouts (LIMIT 20) -------- /
// Retrieve todays workout(s) -------------- /?date=today
// Retrieve yesterdays workout(s) ---------- /?date=yesterday
// Retrieve tomorrows workout(s) ----------- /?date=tomorrow
// Retrieve future workout(s) -------------- /?date=future
// Retrieve workout(s) at a specific date -- /?date=YYYY-MM-DD
// Retrieve workout(s) by category --------- /?category=legs
// Retrieve workout(s) by type ------------- /?type=strength
// Retrieve workout(s) by view ------------- /?view=public
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
  // 'strength', 'deload', 'cardio', 'therapy'
  return await createWorkoutMutation(res, req.body);
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

export default (parentRouter: Router) => {
  parentRouter.use('/workouts', router);
};
