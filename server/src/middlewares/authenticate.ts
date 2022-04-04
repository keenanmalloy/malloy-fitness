import { NextFunction, Response, Request } from 'express';
import { getLoginSession } from 'sessions';

/**
 * Checks if the user is logged in.
 * If not, sends back a 401 Unauthorized request.
 * Adds state to express locals to access account information in queries.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await getLoginSession(req);
    if (!!session) {
      // Adds the account and request URL to state which is
      // an object that's shared with the request / response cycle.
      res.locals.state = {
        account: session.account,
        requestUrl: `${req.baseUrl}${req.route.path}`,
        workoutId: req.params.workoutId,
        exerciseId: req.params.exerciseId,
        httpMethod: req.method, // GET, PUT, POST, PATCH, DELETE, etc.
      };
      return next();
    }
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: 'Please login' });
  } catch (error) {
    return (
      res
        .status(401)
        // @ts-ignore
        .json({ message: 'Unauthorized', error: error.message })
    );
  }
};
