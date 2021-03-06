import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { createExerciseMutation } from 'controllers/exercises/createExerciseMutation';
import { deleteExerciseMutation } from 'controllers/exercises/deleteExerciseMutation';
import { retrieveExerciseQuery } from 'controllers/exercises/retrieveExerciseQuery';
import { retrieveExercisesByMuscleGroupQuery } from 'controllers/exercises/retrieveExercisesByMuscleGroupsQuery';
import { retrieveExercisesQuery } from 'controllers/exercises/retrieveExercisesQuery';
import { updateExerciseMutation } from 'controllers/exercises/updateExerciseMutation';
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
  // if exerciseId is not a number, return 404
  if (isNaN(+req.params.exerciseId)) {
    return res.status(404).send('Exercise not found');
  }
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
