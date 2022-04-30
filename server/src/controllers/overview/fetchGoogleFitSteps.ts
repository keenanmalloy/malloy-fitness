import axios from 'axios';
import { PROVIDERS } from 'config/providers';
import { Response, Request } from 'express';
import { getGoogleFitSession, setGoogleFitSession } from 'sessions';

export const fetchGoogleFitSteps = async (
  req: Request,
  res: Response,
  startTimeQuery: string,
  endTimeQuery: string
) => {
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

    const steps: number =
      data.bucket
        .map((bucket: any) => {
          return bucket.dataset[0];
        })[0]
        .point.map((point: any) => {
          if (!point) return null;
          return point.value[0].intVal;
        })[0] ?? 0;

    return steps;
  } catch (error) {
    return null;
  }
};
