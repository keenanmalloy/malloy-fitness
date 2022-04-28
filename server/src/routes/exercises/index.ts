import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { createExerciseMutation } from 'queries/exercises/createExerciseMutation';
import { deleteExerciseMutation } from 'queries/exercises/deleteExerciseMutation';
import { retrieveExerciseQuery } from 'queries/exercises/retrieveExerciseQuery';
import { retrieveExercisesByMuscleGroupQuery } from 'queries/exercises/retrieveExercisesByMuscleGroupsQuery';
import { retrieveExercisesQuery } from 'queries/exercises/retrieveExercisesQuery';
import { updateExerciseMutation } from 'queries/exercises/updateExerciseMutation';
import muscleGroups from './muscle-groups';

const router = Router();

// Retrieve all exercises ---------------------- /
// Search exercises ---------------------------- /?q=barbell
// Select exercises from array of IDS -----------/?ids=1,2,3
// Retrieve related exercises by muscle-group -- /?mgIds=1,2,3
// category
// view
// profile
// sortBy
router.get('/', authenticate, async (req, res) => {
  if (req.query.mgIds) {
    await retrieveExercisesByMuscleGroupQuery(req, res);
  } else {
    await retrieveExercisesQuery(req, res);
  }
});

// Retrieve exercise
router.get('/:exerciseId', authenticate, async (req, res) => {
  await retrieveExerciseQuery(res, req.params.exerciseId);
});

// Create new exercise
router.post('/', authenticate, async (req, res) => {
  await createExerciseMutation(res, req.body);
});

// Delete exercise
router.delete('/:exerciseId', authenticate, authorize, async (req, res) => {
  await deleteExerciseMutation(res, req.params.exerciseId);
});

// Update exercise
router.put('/:exerciseId', authenticate, authorize, async (req, res) => {
  await updateExerciseMutation(res, req.body, req.params.exerciseId);
});

muscleGroups(router);

export default (parentRouter: Router) => {
  parentRouter.use('/exercises', router);
};
