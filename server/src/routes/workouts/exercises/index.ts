<<<<<<< HEAD
import { Router } from 'express';
import { addExerciseToWorkoutMutation } from 'queries/addExerciseToWorkoutMutation';
import { removeExerciseFromWorkoutMutation } from 'queries/removeExerciseFromWorkoutMutation';
import { updateWorkoutExerciseMutation } from 'queries/updateWorkoutExerciseMutation';
=======
import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { authorize } from "middlewares/authorize";
import { addExerciseToWorkoutMutation } from "queries/addExerciseToWorkoutMutation";
import { removeExerciseFromWorkoutMutation } from "queries/removeExerciseFromWorkoutMutation";
import { updateWorkoutExerciseMutation } from "queries/updateWorkoutExerciseMutation";
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c

const router = Router();

// Add exercise to the workout
<<<<<<< HEAD
router.post('/:id/exercises/', async (req, res) => {
  await addExerciseToWorkoutMutation(res, req.body, req.params.id);
});

// Remove exercise in the workout
router.delete('/:id/exercises/:exerciseId', async (req, res) => {
  await removeExerciseFromWorkoutMutation(
    res,
    req.params.id,
    req.params.exerciseId
  );
});

// Update exercise in the workout
router.put('/:id/exercises/:exerciseId', async (req, res) => {
  await updateWorkoutExerciseMutation(
    res,
    req.body,
    req.params.id,
    req.params.exerciseId
  );
});
=======
router.post(
  "/:workoutId/exercises/",
  authenticate,
  authorize,
  async (req, res) => {
    await addExerciseToWorkoutMutation(res, req.body, req.params.workoutId);
  }
);

// Remove exercise in the workout
router.delete(
  "/:workoutId/exercises/:exerciseId",
  authenticate,
  authorize,
  async (req, res) => {
    await removeExerciseFromWorkoutMutation(
      res,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);

// Update exercise in the workout
router.put(
  "/:workoutId/exercises/:exerciseId",
  authenticate,
  authorize,
  async (req, res) => {
    await updateWorkoutExerciseMutation(
      res,
      req.body,
      req.params.workoutId,
      req.params.exerciseId
    );
  }
);
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
