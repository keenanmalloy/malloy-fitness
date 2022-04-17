import { NextFunction, Response, Request } from 'express';
import { authorizeAdminQuery } from 'queries/authorizeAdminQuery';

/**
 * Checks the DB for role to authorize resource.
 * If authorized as an admin, continue, if not, send back a 403 Forbidden.
 */
export const admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAdmin } = await authorizeAdminQuery(res);
  if (isAdmin) {
    return next();
  }
  return res.status(403).json({
    role: res.locals.state.account.role,
    message: 'Unauthorized',
  });
};
