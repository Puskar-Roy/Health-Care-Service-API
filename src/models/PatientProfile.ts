import { Schema, model, Document, Types } from "mongoose";

export interface IPatientProfile extends Document {
  user: Types.ObjectId;
  age: number;
  gender: "male" | "female" | "other";
  medicalHistory: string[];
}

const patientProfileSchema = new Schema<IPatientProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  medicalHistory: [String],
});

export const PatientProfile = model<IPatientProfile>(
  "PatientProfile",
  patientProfileSchema
);
