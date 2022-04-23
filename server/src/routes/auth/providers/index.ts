import { Router } from 'express';

import google from './google';
import mfp from './mfp';
import samsung from './samsung';

const router = Router();

google(router);
samsung(router);
mfp(router);

export default (parentRouter: Router) => {
  parentRouter.use('/providers', router);
};
