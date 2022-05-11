import { Router } from 'express';
import goals from './goals';

const router = Router();

goals(router);

export default (parentRouter: Router) => {
  parentRouter.use('/account', router);
};
