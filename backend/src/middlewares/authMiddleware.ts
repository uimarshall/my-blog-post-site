/* eslint-disable no-extra-boolean-cast */
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user';
import ErrorHandler from '../utils/errorHandler';
import { type NextFunction, type Request, type Response } from 'express';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

interface JwtPayload {
  id: string;
}

// Check if user is authenticated or not
const requireAuthentication = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token } = req.cookies;
  if (!Boolean(token)) {
    next(new ErrorHandler('Please Login first to access this resource ', 401));
    return;
  }

  // const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

  req.user = await User.findById(decoded.id);

  next();
});

// Handling user Roles - Admin

const requireAdminRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // A user will sign in first by running the requireAuthentication middleware and then we will check if the user is an admin or not.

  const user = await User.findById(req.user?.id);
  if (user?.isAdmin === true) {
    next();
  } else {
    next(new ErrorHandler('You are not authorized to access this resource, Admin only', 403));
  }
});

// Handling user Roles - Super Admin

const requireAuthorizedRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler(
          `Only admin can access this resource, your role: (${req.user.role}) is forbidden from accessing this resource!`,
          403
        )
      );
      return;
    }
    next();
  };

export { requireAuthentication, requireAuthorizedRoles, requireAdminRole };
