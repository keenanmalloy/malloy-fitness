import { Router } from 'express';
import { authenticate } from 'middlewares/authenticate';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const samsungClient = axios.create({
  baseURL: 'https://data-api.samsunghealth.com',
  headers: {
    'Content-Type': 'application/json',
    'X-Request-ID': uuidv4(),
  },
});

const router = Router();

// Redirects the user to samsung authorization page
router.get('/', authenticate, async (req, res) => {
  const client_id = 'YOUR_CLIENT_ID';
  const response_type = 'code';
  const scope =
    'com.samsung.health.user_profile.read com.samsung.shealth.step_daily_trend.read';
  const redirect_uri = 'http://localhost:4000/auth/providers/samsung/callback';
  const end_time = '2019-12-31T23:59:59.000Z';
  const login_id = 'YOUR_LOGIN_ID';

  return res.redirect(
    `https://data-api.samsunghealth.com/auth/v1/authorize?client_id=${client_id}&response_type=${response_type}&scope=${scope}&redirect_uri=${redirect_uri}&end_time=${end_time}&login_id=${login_id}`
  );
});

// localhost:4000/auth/providers/samsung

router.get('/callback', authenticate, async (req, res) => {
  console.log('CALLBACK');
  // Successful authentication, redirect home.
  // generate tokens and redirect back home.

  // const account = req.user;
  // const session = { account };

  // await setSamsungSession(res, session);

  // redirect back user to app url, need to change URL to env variable
  samsungClient.get('/auth/v1/authorize', {
    params: {},
  });
});

export default (parentRouter: Router) => {
  parentRouter.use('/samsung', router);
};

/** GET
 * /auth/v1/authorize
 *
 * client_id=your.client.id
 * response_type=code
 * scope=com.samsung.shealth.step_daily_trend.read%20com.samsung.health.user_profile.read
 * redirect_uri=http://localhost:4000/auth/providers/samsung/callback
 *
 */
