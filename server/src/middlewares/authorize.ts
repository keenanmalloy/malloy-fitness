import { NextFunction, Response, Request } from "express";
import { authorizeExerciseQuery } from "queries/authorizeExerciseQuery";
import { authorizeWorkoutQuery } from "queries/authorizeWorkoutQuery";

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

  if (!!workoutId) {
    const { isAuthorized } = await authorizeWorkoutQuery(res, workoutId);
    if (isAuthorized) {
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!!exerciseId) {
    const { isAuthorized } = await authorizeExerciseQuery(res, exerciseId);
    if (isAuthorized) {
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  }

  return next();
};
