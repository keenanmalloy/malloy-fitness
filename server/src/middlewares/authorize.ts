import { NextFunction, Response, Request } from 'express';
import { authorizeSessionQuery } from 'controllers/authorize/authorizeSessionQuery';
import { authorizeExerciseQuery } from 'controllers/authorize/authorizeExerciseQuery';
import { authorizeWorkoutQuery } from 'controllers/authorize/authorizeWorkoutQuery';

/**
 * Checks the DB for authorization of resource.
 * If authorized, continue, if not, send back a 403 Forbidden.
 */
export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestUrl = res.locals.state.requestUrl;
  const workoutId = res.locals.state.workoutId;
  const exerciseId = res.locals.state.exerciseId;
  const sessionId = res.locals.state.sessionId;

  if (!!exerciseId && isNaN(+req.params.exerciseId)) {
    return res.status(404).send();
  }
  if (!!workoutId && isNaN(+req.params.workoutId)) {
    return res.status(404).send();
  }
  if (!!sessionId && isNaN(+req.params.sessionId)) {
    return res.status(404).send();
  }

  const isDeveloper = res.locals.state.account.role === 'developer';
  if (isDeveloper) {
    return next();
  }

  let isForbidden = false;

  if (!!sessionId) {
    const { isAuthorized } = await authorizeSessionQuery(res, sessionId);
    if (!isAuthorized) {
      isForbidden = true;
    }
  }

  if (!!workoutId) {
    const { isAuthorized } = await authorizeWorkoutQuery(res, workoutId);
    if (!isAuthorized) {
      isForbidden = true;
    }
  }

  if (!!exerciseId) {
    const { isAuthorized } = await authorizeExerciseQuery(res, exerciseId);
    if (!isAuthorized) {
      isForbidden = true;
    }
  }

  if (isForbidden) {
    return res.status(403).json({
      role: res.locals.state.account.role,
      message: 'Unauthorized',
    });
  }

  return next();
};
