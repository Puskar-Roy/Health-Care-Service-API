import jwt from 'jsonwebtoken';
import config from '../config/config';
import { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';
export const createToken = ({ _id, role }: { _id: string; role: string }) => {
  return jwt.sign({ _id, role }, config.JWT_SECRET, {
    expiresIn: "7d",
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