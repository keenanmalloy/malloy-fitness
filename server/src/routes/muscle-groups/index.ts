import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { authorize } from 'middlewares/authorize';
import { createMuscleGroupMutation } from 'queries/createMuscleGroup';
import { deleteMuscleGroupMutation } from 'queries/deleteMuscleGroupMutation';
import { retrieveMuscleGroupQuery } from 'queries/retrieveMuscleGroupQuery';
import { retrieveMuscleGroupsQuery } from 'queries/retrieveMuscleGroupsQuery';
import { updateMuscleGroupMutation } from 'queries/updateMuscleGroup';

const router = Router();

// Retrieve all muscle groups
router.get('/', async (req, res) => {
  await retrieveMuscleGroupsQuery(res);
});

// Retrieve muscle group
router.get('/:id', async (req, res) => {
  await retrieveMuscleGroupQuery(res, req.params.id);
});

// Create muscle group
router.post('/', authenticate, authorize, async (req, res) => {
  await createMuscleGroupMutation(res, req.body);
});

// Update muscle group
router.put('/:id', authenticate, authorize, async (req, res) => {
  await updateMuscleGroupMutation(res, req.body, req.params.id);
});

// Delete muscle group
router.delete('/:id', authenticate, authorize, async (req, res) => {
  await deleteMuscleGroupMutation(res, req.params.id);
});

export default (parentRouter: Router) => {
  parentRouter.use('/muscle-groups', router);
};
