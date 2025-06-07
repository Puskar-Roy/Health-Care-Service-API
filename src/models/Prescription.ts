import { Schema, model, Document, Types } from "mongoose";

export interface IPrescription extends Document {
  appointment: Types.ObjectId;
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  date: Date;
  medications: string[];
  notes: string;
}

const prescriptionSchema = new Schema<IPrescription>({
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  doctor: { type: Schema.Types.ObjectId, ref: "DoctorProfile", required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "PatientProfile",
    required: true,
  },
  date: { type: Date, default: Date.now },
  medications: [String],
  notes: String,
});

export const Prescription = model<IPrescription>(
  "Prescription",
  prescriptionSchema
);
