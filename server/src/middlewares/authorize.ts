import { NextFunction, Response, Request } from "express";
import { authorizeExerciseQuery } from "queries/authorizeExerciseQuery";
import { authorizeWorkoutQuery } from "queries/authorizeWorkoutQuery";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accountId = res.locals.state.account.account_id;
  const requestUrl = res.locals.state.requestUrl;
  const workoutId = res.locals.state.workoutId;
  const exerciseId = res.locals.state.exerciseId;

  if (!!workoutId) {
    const isAuthorized = await authorizeWorkoutQuery(workoutId, accountId);
    if (isAuthorized) {
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  }

  if(!!exerciseId) {
    const isAuthorized = await authorizeExerciseQuery(workoutId, accountId);
    if (isAuthorized) {
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  }

  return next();
};
