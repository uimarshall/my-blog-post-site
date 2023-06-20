import { cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  NODE_ENV: str(),
  MONGO_URI_LOCAL: str(),
});

export default env;
