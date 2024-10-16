import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGOURI: process.env.MONGOURI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  DEV_ENV: process.env.DEV_MODE,
  REDIS_HOST : process.env.REDIS_HOST,
  REDIS_PORT : parseInt(process.env.REDIS_PORT as string),
};

export default config;
