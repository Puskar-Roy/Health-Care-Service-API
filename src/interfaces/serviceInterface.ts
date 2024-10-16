import { Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
}