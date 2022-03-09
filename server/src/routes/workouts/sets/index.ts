import { Router } from "express";
import { retrieveSetsQuery } from "queries/retrieveSetsQuery";
import { retrieveSetsByExerciseQuery } from "queries/retrieveSetsByExerciseQuery";
import { createSetMutation } from "queries/createSetMutation";
import { deleteSetMutation } from "queries/deleteSetMutation";
import { updateSetMutation } from "queries/updateSetMutation";
import { deleteSetsByExerciseMutation } from "queries/deleteSetsByExerciseMutation";

const router = Router();

// Retrieve all sets by workout
router.get("/:id/sets", async (req, res) => {
  await retrieveSetsQuery(res, req.params.id);
});

// Retrieve all sets by workout by exercise
router.get("/:id/exercise/:exerciseId/sets", async (req, res) => {
  await retrieveSetsByExerciseQuery(res, req.params.id, req.params.exerciseId);
});

// Create new set
router.post("/:id/sets", async (req, res) => {
  await createSetMutation(res, req.body, req.params.id);
});

// Delete set
router.delete("/:id/sets/:setId", async (req, res) => {
  await deleteSetMutation(res, req.params.setId);
});

// Delete sets by workout by exercise
router.delete("/:id/exercise/:exerciseId/sets", async (req, res) => {
  await deleteSetsByExerciseMutation(res, req.params.id, req.params.exerciseId);
});

// Update set
router.put("/:id/sets/:setId", async (req, res) => {
  await updateSetMutation(res, req.body, req.params.setId);
});

export default (parentRouter: Router) => {
  parentRouter.use("/", router);
};
