import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";
import { AuthRequest } from "../middleware/middleware";

export const bookAppointment = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({ msg: "Only patients can book" });
    console.log(req.user?.userId);
    
  const { doctorId, date, time, symptoms } = req.body;


  try {
    const exists = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });
    if (exists) return res.status(400).json({ msg: "Slot already booked" });

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: req.user.userId,
      date,
      time,
      symptoms,
    });

    res.status(201).json({ msg: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ msg: "Error booking appointment", err });
  }
};


export const getAvailableSlots = async (req: Request, res: Response) => {
  const doctorId = req.params.id;
  const date = req.query.date as string; // e.g., '2025-06-08'

  try {
    const doctor = await DoctorProfile.findOne({ user: doctorId });
    console.log(doctorId);
    console.log();
    
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

    const day = new Date(date).toLocaleString("en-US", { weekday: "long" });

    const daySlots = doctor.slots.find((slot) => slot.day === day);
    if (!daySlots) return res.json({ slots: [] });

    const existingAppointments = await Appointment.find({
      doctor: doctor._id,
      date,
      status: { $in: ["booked", "completed"] },
    });

    const bookedTimes = existingAppointments.map((a) => a.time);

    const availableSlots: string[] = [];

    const [startH, startM] = daySlots.startTime.split(":").map(Number);
    const [endH, endM] = daySlots.endTime.split(":").map(Number);

    let current = new Date(`2020-01-01T${daySlots.startTime}:00`);
    const end = new Date(`2020-01-01T${daySlots.endTime}:00`);

    while (current < end) {
      const timeStr = current.toTimeString().slice(0, 5); // HH:mm
      if (!bookedTimes.includes(timeStr)) {
        availableSlots.push(timeStr);
      }
      current.setMinutes(current.getMinutes() + daySlots.slotDuration);
    }

    res.json({ slots: availableSlots });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};


//Patient: View Upcoming Appointments - /appointments/patient/upcoming
export const getUpcomingAppointmentsForPatient = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({ msg: "Only patients allowed" });

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    const appointments = await Appointment.find({
      patient: req.user.userId,
      date: { $gte: today },
      status: { $in: ["booked", "completed"] },
    })
      .populate("doctor", "name specialization")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching appointments", err });
  }
};



// Patient: View Appointment History /appointments/patient/history
export const getAppointmentHistoryForPatient = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'patient') return res.status(403).json({ msg: 'Only patients allowed' });

  const today = new Date().toISOString().split('T')[0];

  try {
    const history = await Appointment.find({
      patient: req.user.userId,
      date: { $lt: today }
    })
      .populate('doctor', 'name specialization')
      .sort({ date: -1, time: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching history', err });
  }
};






// Doctor: View Upcoming Appointments /appointments/doctor/upcoming
export const getUpcomingAppointmentsForDoctor = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors allowed' });

  const today = new Date().toISOString().split('T')[0];

  try {
    const appointments = await Appointment.find({
      doctor: req.user.userId,
      date: { $gte: today },
      status: { $in: ['booked', 'completed'] }
    })
      .populate('patient', 'name age gender')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching appointments', err });
  }
};


// Doctor: View Appointment History /appointments/doctor/history
export const getAppointmentHistoryForDoctor = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors allowed' });

  const today = new Date().toISOString().split('T')[0];

  try {
    const history = await Appointment.find({
      doctor: req.user.userId,
      date: { $lt: today }
    })
      .populate('patient', 'name age gender')
      .sort({ date: -1, time: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching history', err });
  }
};