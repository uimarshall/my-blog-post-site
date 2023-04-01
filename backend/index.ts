import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';

import logger from './logger/logger';
import morganMiddleware from './logger/morganMiddleware';
import connectDb from './config/db';

// Load the environment variables
dotenv.config({ path: 'backend/config/.env' });

const app: Express = express();

// Connect Db
void connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morganMiddleware);

const port = process.env.PORT ?? 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Configurations + Linting + found solution, better');
});
app.get('/greet', (req: Request, res: Response) => {
  res.send('Hello Guys');
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
