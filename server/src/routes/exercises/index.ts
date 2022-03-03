import { Router } from "express";
import { createExerciseMutation } from "queries/createExerciseMutation";
import { deleteExerciseMutation } from "queries/deleteExerciseMutation";
import { retrieveExerciseQuery } from "queries/retrieveExerciseQuery";
import { retrieveExercisesQuery } from "queries/retrieveExercisesQuery";
import { updateExerciseMutation } from "queries/updateExerciseMutation";

const router = Router();

// Retrieve all exercises
router.get("/", async (req, res) => {
  await retrieveExercisesQuery(res);
});

// Create new exercise
router.post("/", async (req, res) => {
  await createExerciseMutation(res, req.body);
});

// Retrieve exercise
router.get("/:id", async (req, res) => {
  await retrieveExerciseQuery(res, req.params.id);
});

// Delete exercise
router.delete("/:id", async (req, res) => {
  await deleteExerciseMutation(res, req.params.id);
});

// Update exercise
router.put("/:id", async (req, res) => {
  await updateExerciseMutation(res, req.body, req.params.id);
});

export default (parentRouter: Router) => {
  parentRouter.use("/exercises", router);
};
