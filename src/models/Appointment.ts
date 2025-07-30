import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  date: string;
  time: string; // HH:mm
  status: "booked" | "completed" | "cancelled";
  symptoms: string[]; // Fixed: Changed from Types.ObjectId[] to string[]
  // Additional useful fields
  appointmentType?: "in-person" | "online";
  department?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
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
    // Additional fields to match your frontend data
    appointmentType: {
      type: String,
      enum: ["in-person", "online"],
      default: "in-person",
    },
    department: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add indexes for better query performance
appointmentSchema.index({ doctor: 1, date: 1, time: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ date: 1 });

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
