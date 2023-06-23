import { type NextFunction, type Request, type Response } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export default (fn: AsyncFunction) => async (req: Request, res: Response, next: NextFunction) =>
  await Promise.resolve(fn(req, res, next)).catch(next);
