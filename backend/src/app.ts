import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import morganMiddleware from '../logger/morganMiddleware';

// import env from './utils/validateEnv';

// Load the environment variables
dotenv.config({ path: 'backend/src/config/.env' });

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morganMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Configurations + Linting + found solution, better');
});
app.get('/greet', (req: Request, res: Response) => {
  res.send('Hello Guys');
});
app.get('/time', (req: Request, res: Response) => {
  res.json({ time: new Date().toISOString() });
});

export default app;