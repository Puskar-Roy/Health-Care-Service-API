import mongoose, { Schema } from 'mongoose';
import { IService } from '../interfaces/serviceInterface'

const serviceSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

export default mongoose.model<IService>('Service', serviceSchema);
