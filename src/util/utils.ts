import jwt from 'jsonwebtoken';
import config from '../config/config';
import { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';
export const createToken = (_id: string) => {
  return jwt.sign({ _id: _id }, config.JWT_SECRET, {
    expiresIn: config.JWT_COOKIE_EXPIRES_IN,
  });
};


const whitelist = ['https://<your-production-api-link>'];

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};


export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});