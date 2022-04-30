import { google } from 'googleapis';
import { RequestHandler, Router } from 'express';
import { getGoogleFitSession, setGoogleFitSession } from 'sessions';
import { PROVIDERS } from 'config/providers';
import axios from 'axios';

export default (router: Router): void => {
  const options = PROVIDERS.GOOGLE;

  initProvider({
    router,
    middleware: (req, res, next) => {
      if (!options.clientID || !options.clientSecret) {
        return res
          .status(400)
          .send(`Missing environment variables for Google OAuth.`);
      } else {
        return next();
      }
    },
  });
};

interface Props {
  router: Router;
  middleware?: RequestHandler;
}

const initProvider = ({ router, middleware }: Props): void => {
  const subRouter = Router();
  if (middleware) {
    subRouter.use(middleware);
  }

  // Redirects to google auth page.
  subRouter.get('/', (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
      PROVIDERS.GOOGLE.clientID,
      PROVIDERS.GOOGLE.clientSecret,
      `${process.env.API_ENDPOINT}/auth/providers/google/fit/callback`
    );

    const scopes = [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.reproductive_health.read',
      'https://www.googleapis.com/auth/fitness.sleep.read',
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: JSON.stringify({
        callbackUrl: `${process.env.API_ENDPOINT}/auth/providers/google/fit/callback`,
      }),
    });

    res.redirect(url);
  });

  // Sets the session and redirects to the homepage.
  subRouter.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code as string;
    const scopes = (req.query.scope as string).split(' ');
    const state = JSON.parse(req.query.state as string);

    if (scopes.length !== 3) {
      return res.status(400).json({
        error:
          'Must authorize all scopes to integrate Tracked with Google-Fit.',
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      PROVIDERS.GOOGLE.clientID,
      PROVIDERS.GOOGLE.clientSecret,
      `${process.env.API_ENDPOINT}/auth/providers/google/fit/callback`
    );

    try {
      const data = await oauth2Client.getToken(authorizationCode);
      const tokens = data.tokens;
      await setGoogleFitSession(res, tokens);
    } catch (error) {
      console.log({ error });
    }

    // redirect back user to app url, need to change URL to env variable
    res.redirect(`${process.env.APP_ENDPOINT}/`);
  });

  // fetches the users step data
  subRouter.get('/steps', async (req, res) => {
    const startTimeQuery = req.query.startTime as string;
    const endTimeQuery = req.query.endTime as string;

    if (!startTimeQuery || !endTimeQuery) {
      return res.status(400).json({
        error: 'Missing start / end time query params (UNIX) milliseconds',
      });
    }

    try {
      const session = await getGoogleFitSession(req);

      const getAccessToken = async () => {
        const accessToken = session.access_token;
        const refreshToken = session.refresh_token;
        const tokenExpiryDate = session.expiry_date;
        const now = Date.now();

        if (tokenExpiryDate < now) {
          // refetch the accessToken
          const { data } = await axios({
            method: 'POST',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: `refresh_token=${refreshToken}&client_id=${PROVIDERS.GOOGLE.clientID}&client_secret=${PROVIDERS.GOOGLE.clientSecret}&grant_type=refresh_token`,
          });

          await setGoogleFitSession(res, {
            refresh_token: refreshToken,
            ...data,
          });

          return data.access_token;
        }

        return accessToken;
      };

      const accessToken = await getAccessToken();

      const { data } = await axios({
        method: 'POST',
        url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeQuery, // day start time in UNIX
          endTimeMillis: endTimeQuery, // day end time in UNIX
        },
      });

      const steps =
        data.bucket
          .map((bucket: any) => {
            return bucket.dataset[0];
          })[0]
          .point.map((point: any) => {
            if (!point) return null;
            return point.value[0].intVal;
          })[0] ?? 0;

      return res.json({
        steps: steps,
        status: 200,
        message: 'success',
      });
    } catch (error) {
      console.log({ error });
      return res.status(400).json({
        error: 'Missing google-fit session',
      });
    }
  });

  // fetches the users step data
  subRouter.get('/sleep', async (req, res) => {
    const startTimeQuery = req.query.startTime as string;
    const endTimeQuery = req.query.endTime as string;

    if (!startTimeQuery || !endTimeQuery) {
      return res.status(400).json({
        error: 'Missing start / end time query params (UNIX) milliseconds',
      });
    }

    try {
      const session = await getGoogleFitSession(req);

      const getAccessToken = async () => {
        const accessToken = session.access_token;
        const refreshToken = session.refresh_token;
        const tokenExpiryDate = session.expiry_date;
        const now = Date.now();

        if (tokenExpiryDate < now) {
          // refetch the accessToken
          const { data } = await axios({
            method: 'POST',
            url: 'https://www.googleapis.com/oauth2/v4/token',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: `refresh_token=${refreshToken}&client_id=${PROVIDERS.GOOGLE.clientID}&client_secret=${PROVIDERS.GOOGLE.clientSecret}&grant_type=refresh_token`,
          });

          await setGoogleFitSession(res, {
            refresh_token: refreshToken,
            ...data,
          });

          return data.access_token;
        }

        return accessToken;
      };

      const accessToken = await getAccessToken();

      const { data } = await axios({
        method: 'POST',
        url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          aggregateBy: [{ dataTypeName: 'com.google.sleep.segment' }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeQuery, // day start time in UNIX
          endTimeMillis: endTimeQuery, // day end time in UNIX
        },
      });

      const sleep =
        data.bucket
          .map((bucket: any) => {
            return bucket.dataset[0];
          })[0]
          .point.map((point: any) => {
            if (!point) return null;
            return point.value[0].intVal;
          })[0] ?? 0;

      return res.json({
        sleep: sleep,
        status: 200,
        message: 'success',
      });
    } catch (error) {
      console.log({ error });
      return res.status(400).json({
        error: 'Missing google-fit session',
      });
    }
  });

  router.use(`/google/fit`, subRouter);
};

/**
// Get the actual step data for today below =>
POST: https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate
BODY:
{
  "aggregateBy": [{
        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
   }],
   "bucketByTime": { "durationMillis": 86400000 },
   "startTimeMillis": 1505796042776, // day start time in UNIX
   "endTimeMillis": 1506796042776 // day end time in UNIX
}
 */
