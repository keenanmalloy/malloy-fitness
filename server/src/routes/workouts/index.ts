<<<<<<< HEAD
import { Router } from 'express';
import { cloneWorkoutMutation } from 'queries/cloneWorkoutMutation';
import { createWorkoutMutation } from 'queries/createWorkoutMutation';
import { deleteWorkoutMutation } from 'queries/deleteWorkoutMutation';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { retrieveWorkoutsQuery } from 'queries/retrieveWorkoutsQuery';
import { updateWorkoutMutation } from 'queries/updateWorkoutMutation';
import setsRouter from './sets';
import exercisesRouter from './exercises';

const router = Router();

// Retrieve all workouts
router.get('/', async (req, res) => {
  await retrieveWorkoutsQuery(res);
});

// Create new workout
router.post('/', async (req, res) => {
  await createWorkoutMutation(res, req.body);
});

// Retrieve workout
router.get('/:id', async (req, res) => {
  await retrieveWorkoutQuery(res, req.params.id);
});

// Clone workout
router.post('/:id/copy', async (req, res) => {
  await cloneWorkoutMutation(res, req.params.id);
});

// Delete workout
router.delete('/:id', async (req, res) => {
  await deleteWorkoutMutation(res, req.params.id);
});

// Update workout
router.put('/:id', async (req, res) => {
  await updateWorkoutMutation(res, req.body, req.params.id);
});

exercisesRouter(router);
setsRouter(router);
=======
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { authorize } from "middlewares/authorize";
import { cloneWorkoutMutation } from "queries/cloneWorkoutMutation";
import { createWorkoutMutation } from "queries/createWorkoutMutation";
import { deleteWorkoutMutation } from "queries/deleteWorkoutMutation";
import { retrieveWorkoutQuery } from "queries/retrieveWorkoutQuery";
import { retrieveWorkoutsQuery } from "queries/retrieveWorkoutsQuery";
import { updateWorkoutMutation } from "queries/updateWorkoutMutation";

import setsRouter from "./sets";
import exercisesRouter from "./exercises";
import startWorkoutRouter from "./start";
import endWorkoutRouter from "./end";

const router = Router();

// Retrieve all workouts (LIMIT 20) -------- /
// Retrieve todays workout(s) -------------- /?date=today
// Retrieve yesterdays workout(s) ---------- /?date=yesterday
// Retrieve tomorrows workout(s) ----------- /?date=tomorrow
// Retrieve workout(s) at a specific date -- /?date=YYYY-MM-DD
// Retrieve workout(s) by category --------- /?category=legs
// Retrieve workout(s) by completed true --- /?complete=1
// Retrieve workout(s) by completed false -- /?complete=0
router.get("/", authenticate, async (req, res) => {
  await retrieveWorkoutsQuery(req, res);
});

// Retrieve workout
router.get("/:workoutId", authenticate, authorize, async (req, res) => {
  await retrieveWorkoutQuery(res, req.params.workoutId);
});

// Create new workout
router.post("/", authenticate, authorize, async (req, res) => {
  await createWorkoutMutation(res, req.body);
});

// Clone workout
router.post("/:workoutId/copy", authenticate, async (req, res) => {
  await cloneWorkoutMutation(res, req.params.workoutId);
});

// Delete workout
router.delete("/:workoutId", authenticate, authorize, async (req, res) => {
  await deleteWorkoutMutation(res, req.params.workoutId);
});

// Update workout
router.put("/:workoutId", authenticate, authorize, async (req, res) => {
  await updateWorkoutMutation(res, req.body, req.params.workoutId);
});

setsRouter(router);
exercisesRouter(router);
startWorkoutRouter(router);
endWorkoutRouter(router);
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c

export default (parentRouter: Router) => {
  parentRouter.use('/workouts', router);
};
