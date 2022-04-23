import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const mfpClient = axios.create({
  baseURL: 'https://api.myfitnesspal.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const router = Router();

// OAuth Callback URL *
// https://api.trckd.ca/auth/providers/mfp/callback

// Activity Callback URL *
// https://api.trckd.ca/auth/providers/mfp/activity

// Redirects the user to mfp authorization page
router.get('/', authenticate, async (req, res) => {
  console.log('REDIRECT TO MFP AUTHORIZATION');
});

router.get('/callback', authenticate, async (req, res) => {
  console.log('CALLBACK FROM MFP');
});

router.get('/activity', authenticate, async (req, res) => {
  console.log('ACTIVITY FROM MFP');
});

export default (parentRouter: Router) => {
  parentRouter.use('/mfp', router);
};
