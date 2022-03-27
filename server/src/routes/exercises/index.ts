import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { authorize } from "middlewares/authorize";
import { createExerciseMutation } from "queries/createExerciseMutation";
import { deleteExerciseMutation } from "queries/deleteExerciseMutation";
import { retrieveExerciseQuery } from "queries/retrieveExerciseQuery";
import { retrieveExercisesQuery } from "queries/retrieveExercisesQuery";
import { updateExerciseMutation } from "queries/updateExerciseMutation";

const router = Router();

// Retrieve all exercises ----- /
// Search exercises ----------- /?q=barbell
router.get("/", async (req, res) => {
  await retrieveExercisesQuery(req, res);
});

// Retrieve exercise
router.get("/:exerciseId", async (req, res) => {
  await retrieveExerciseQuery(res, req.params.exerciseId);
});

// Create new exercise
router.post("/", authenticate, authorize, async (req, res) => {
  await createExerciseMutation(res, req.body);
});

// Delete exercise
router.delete("/:exerciseId", authenticate, authorize, async (req, res) => {
  await deleteExerciseMutation(res, req.params.exerciseId);
});

// Update exercise
router.put("/:exerciseId", authenticate, authorize, async (req, res) => {
  await updateExerciseMutation(res, req.body, req.params.exerciseId);
});

export default (parentRouter: Router) => {
  parentRouter.use("/exercises", router);
};
