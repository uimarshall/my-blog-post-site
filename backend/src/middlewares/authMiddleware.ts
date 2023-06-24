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
    next(new ErrorHandler('Login first to access this resource.', 401));
    return;
  }

  // const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

  req.user = await User.findById(decoded.id);

  next();
});

export default requireAuthentication;
