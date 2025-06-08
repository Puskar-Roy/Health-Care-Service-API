import { Schema, model, Document, Types } from "mongoose";

export interface IPatientProfile extends Document {
  user: Types.ObjectId;
  age: number;
  gender: "male" | "female" | "other";
  bloodGroup?: string;
  height?: string;
  weight?: string;
  medicalHistory: string[];
}

const patientProfileSchema = new Schema<IPatientProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  height: { type: String, required: false },
  weight: { type: String, required: false },
  bloodGroup: { type: String, required: false },

  medicalHistory: [String],
});

export const PatientProfile = model<IPatientProfile>(
  "PatientProfile",
  patientProfileSchema
);
