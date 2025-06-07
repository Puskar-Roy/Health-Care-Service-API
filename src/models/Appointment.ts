import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  date: string;
  time: string; // HH:mm
  status: "booked" | "completed" | "cancelled";
  symptoms: Types.ObjectId[];
}

const appointmentSchema = new Schema<IAppointment>({
  doctor: { type: Schema.Types.ObjectId, ref: "DoctorProfile", required: true },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "PatientProfile",
    required: true,
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["booked", "completed", "cancelled"],
    default: "booked",
  },
  symptoms: [{ type: String, required: true }],

  // symptoms: [{ type: Schema.Types.ObjectId, ref: "Symptom" }],
});

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
