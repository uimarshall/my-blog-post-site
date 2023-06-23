import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import morganMiddleware from '../logger/morganMiddleware';
import userRoutes from './routes/userRoutes';
import errorMiddleware from './middlewares/errorMiddleware';

// import env from './utils/validateEnv';

// Load the environment variables
dotenv.config({ path: 'backend/src/config/.env' });

const app: Express = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morganMiddleware);
app.use(cors()); // Make sure you Enable CORS correctly, or you will get CORS errors.

// Route middleware

app.use('/api/v1/users', userRoutes);

// Custom Error Middleware to handle error
app.use(errorMiddleware);

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
