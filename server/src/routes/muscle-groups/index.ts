import { Router } from 'express';
import { admin } from 'middlewares/admin';
import { authenticate } from 'middlewares/authenticate';
import { createMuscleGroupMutation } from 'controllers/muscle-groups/createMuscleGroup';
import { deleteMuscleGroupMutation } from 'controllers/muscle-groups/deleteMuscleGroupMutation';
import { retrieveMuscleGroupQuery } from 'controllers/muscle-groups/retrieveMuscleGroupQuery';
import { retrieveMuscleGroupsQuery } from 'controllers/muscle-groups/retrieveMuscleGroupsQuery';
import { updateMuscleGroupMutation } from 'controllers/muscle-groups/updateMuscleGroup';

const router = Router();

// Retrieve all muscle groups
router.get('/', authenticate, async (req, res) => {
  await retrieveMuscleGroupsQuery(res);
});

// Retrieve muscle group
router.get('/:id', authenticate, async (req, res) => {
  // if exerciseId is not a number, return 404
  if (isNaN(+req.params.id)) {
    return res.status(404).send('Muscle-group not found');
  }
  await retrieveMuscleGroupQuery(res, req.params.id);
});

// Create muscle group
router.post('/', authenticate, admin, async (req, res) => {
  await createMuscleGroupMutation(res, req.body);
});

// Update muscle group
router.put('/:id', authenticate, admin, async (req, res) => {
  await updateMuscleGroupMutation(res, req.body, req.params.id);
});

// Delete muscle group
router.delete('/:id', authenticate, admin, async (req, res) => {
  await deleteMuscleGroupMutation(res, req.params.id);
});

export default (parentRouter: Router) => {
  parentRouter.use('/muscle-groups', router);
};
