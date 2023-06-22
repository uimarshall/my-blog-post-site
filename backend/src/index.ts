import app from './app';
import logger from '../logger/logger';

import connectDb from './config/db';

// Connect Db
void connectDb();

const port = process.env.PORT ?? 5000;

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port} in ${process.env.NODE_ENV} mode`);
});
