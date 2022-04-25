import { Router } from 'express';

import google from './google';
import fit from './google/fit';
import mfp from './mfp';
import samsung from './samsung';

const router = Router();

google(router);
fit(router);
samsung(router);
mfp(router);

export default (parentRouter: Router) => {
  parentRouter.use('/providers', router);
};
