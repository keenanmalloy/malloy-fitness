import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import { retrieveMeQuery } from 'queries/retrieveAccountQuery';
import { updateAccountMutation } from 'queries/updateAccountMutation';

const router = Router();

// Retrieve active user by session token
router.get('/', authenticate, async (req, res) => {
  await retrieveMeQuery(req, res);
});

router.patch('/', authenticate, async (req, res) => {
  await updateAccountMutation(res, req.body);
});

export default (parentRouter: Router) => {
  parentRouter.use('/me', router);
};
