import { Schema, model, Document, Types } from "mongoose";

export interface ISlot {
  day: string; // e.g., 'Monday'
  startTime: string; // e.g., '09:00'
  endTime: string; // e.g., '12:00'
  slotDuration: number; // e.g., 15 or 20 (minutes)
}

export interface IDoctorProfile extends Document {
  user: Types.ObjectId;
  specialization: string;
  slots: ISlot[];
}

const slotSchema = new Schema<ISlot>({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  slotDuration: { type: Number, default: 15 },
});

const doctorProfileSchema = new Schema<IDoctorProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  specialization: { type: String, required: true },
  slots: [slotSchema],
});

export const DoctorProfile = model<IDoctorProfile>(
  "DoctorProfile",
  doctorProfileSchema
);
