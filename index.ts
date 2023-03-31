import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';

import logger from './logger/logger';
import morganMiddleware from './logger/morganMiddleware';

dotenv.config();

const app: Express = express();

// Middleware
app.use(morganMiddleware);

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Configurations + Linting + found solution, better');
});
app.get('/greet', (req: Request, res: Response) => {
  res.send('Hello Guys');
});

app.get('/event', (req, res, next) => {
  try {
    throw new Error('Not User!');
  } catch (error) {
    logger.error('Events Error: Unauthenticated user');
    res.status(500).send('Error!');
  }
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
