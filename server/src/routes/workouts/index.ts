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

// Retrieve all workouts
router.get("/", authenticate, async (req, res) => {
  await retrieveWorkoutsQuery(res);
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

export default (parentRouter: Router) => {
  parentRouter.use("/workouts", router);
};
