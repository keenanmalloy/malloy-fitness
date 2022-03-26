import { Router } from "express";
import { retrieveSetsQuery } from "queries/retrieveSetsQuery";
import { retrieveSetsByExerciseQuery } from "queries/retrieveSetsByExerciseQuery";
import { createSetMutation } from "queries/createSetMutation";
import { deleteSetMutation } from "queries/deleteSetMutation";
import { updateSetMutation } from "queries/updateSetMutation";
import { deleteSetsByExerciseMutation } from "queries/deleteSetsByExerciseMutation";
import { authenticate } from "middlewares/authenticate";
import { authorize } from "middlewares/authorize";

const router = Router();

// Retrieve all sets by workout
router.get("/:workoutId/sets", authenticate, authorize, async (req, res) => {
  await retrieveSetsQuery(res, req.params.workoutId);
});

// Retrieve all sets by workout by exercise
router.get(
  "/:workoutId/exercise/:exerciseId/sets",
  authenticate,
  authorize,
  async (req, res) => {
    await retrieveSetsByExerciseQuery(
      res,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);

// Create new set
router.post("/:workoutId/sets", authenticate, authorize, async (req, res) => {
  await createSetMutation(res, req.body, req.params.workoutId);
});

// Delete set
router.delete(
  "/:workoutId/sets/:setId",
  authenticate,
  authorize,
  async (req, res) => {
    await deleteSetMutation(res, req.params.setId);
  }
);

// Delete sets by workout by exercise
router.delete(
  "/:workoutId/exercise/:exerciseId/sets",
  authenticate,
  authorize,
  async (req, res) => {
    await deleteSetsByExerciseMutation(
      res,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);

// Update set
router.put(
  "/:workoutId/sets/:setId",
  authenticate,
  authorize,
  async (req, res) => {
    await updateSetMutation(res, req.body, req.params.setId);
  }
);

export default (parentRouter: Router) => {
  parentRouter.use("/", router);
};
