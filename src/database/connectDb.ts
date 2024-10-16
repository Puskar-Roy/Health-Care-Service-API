import mongoose from 'mongoose';
import config from '../config/config';

mongoose
  .connect(config.MONGOURI)
  .then(() => {
    console.log(`[📥] Connected to MongoDB!`);
  })
  .catch((e) => {
    console.log(`Connection Error - ${e}`);
  });
