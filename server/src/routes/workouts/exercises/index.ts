import { Router } from 'express';
import { addExerciseToWorkoutMutation } from 'queries/addExerciseToWorkoutMutation';
import { removeExerciseFromWorkoutMutation } from 'queries/removeExerciseFromWorkoutMutation';
import { updateWorkoutExerciseMutation } from 'queries/updateWorkoutExerciseMutation';

const router = Router();

// Add exercise to the workout
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

export default (parentRouter: Router) => {
  parentRouter.use('/', router);
};
