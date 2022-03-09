import { Router } from "express";
import { createWorkoutMutation } from "queries/createWorkoutMutation";
import { deleteWorkoutMutation } from "queries/deleteWorkoutMutation";
import { retrieveWorkoutQuery } from "queries/retrieveWorkoutQuery";
import { retrieveWorkoutsQuery } from "queries/retrieveWorkoutsQuery";
import { updateWorkoutMutation } from "queries/updateWorkoutMutation";
import setsRouter from "./sets";

const router = Router();

// Retrieve all workouts
router.get("/", async (req, res) => {
  await retrieveWorkoutsQuery(res);
});

// Create new workout
router.post("/", async (req, res) => {
  await createWorkoutMutation(res, req.body);
});

// Retrieve workout
router.get("/:id", async (req, res) => {
  await retrieveWorkoutQuery(res, req.params.id);
});

// Delete workout
router.delete("/:id", async (req, res) => {
  await deleteWorkoutMutation(res, req.params.id);
});

// Update workout
router.put("/:id", async (req, res) => {
  await updateWorkoutMutation(res, req.body, req.params.id);
});

setsRouter(router)

export default (parentRouter: Router) => {
  parentRouter.use("/workouts", router);
};
