import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";
import { PatientProfile } from "../models/PatientProfile";
import { AuthRequest } from "../middleware/middleware";

export const bookAppointment = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({ msg: "Only patients can book" });

  console.log(req.user?.userId);

  // Destructure with renaming
  const {
    doctor: doctorId,
    date,
    time,
    reason: symptoms,
    type,
    department,
    notes,
   
  } = req.body;


  try {
    // Validation
    if (!doctorId || !date || !time || !symptoms) {
      return res.status(400).json({
        success: false,
        msg: "Doctor, date, time, and reason are required fields",
      });
    }

    // Find patient profile by user ID
    const patientProfile = await PatientProfile.findOne({
      user: req.user.userId,
    });
    if (!patientProfile) {
      return res.status(404).json({
        success: false,
        msg: "Patient profile not found. Please complete your profile first.",
      });
    }

    // Check if slot is already booked
    const exists = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    const exists1 = await DoctorProfile.findOne({
      user : doctorId
    });
    
    
    if (exists) {
      return res.status(400).json({
        success: false,
        msg: "Slot already booked",
      });
    }

    // Create appointment with PatientProfile ID
    const appointment = await Appointment.create({
      doctor: exists1._id,
      patient: patientProfile._id, // Use PatientProfile ID instead of User ID
      date,
      time,
      symptoms: [symptoms], // Converting to array format
    });

    res.status(201).json({
      success: true,
      msg: "Appointment booked successfully",
      data: {
        appointment,
        bookingDetails: {
          type,
          department,
          notes,
        },
      },
    });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({
      success: false,
      msg: "Error booking appointment",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  const userid = req.params.userid; // Changed from id to userid for consistency
  const date = req.query.date as string; // e.g., '2025-06-08'

  try {
    // Find doctor profile by user ID
    const doctor = await DoctorProfile.findOne({ user: userid });
    console.log(userid);

    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

    const day = new Date(date).toLocaleString("en-US", { weekday: "long" });

    const daySlots = doctor.slots.find((slot) => slot.day === day);
    if (!daySlots) return res.json({ slots: [] });

    // Use DoctorProfile ID for finding appointments
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
    // Find patient profile by user ID
    const patientProfile = await PatientProfile.findOne({
      user: req.user.userId,
    });
    if (!patientProfile) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    const appointments = await Appointment.find({
      patient: patientProfile._id, // Use PatientProfile ID
      // date: { $gte: today },
      status: { $in: ["booked", "completed"] },
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name",
        },
        select: "specialization user",
      })
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching appointments", err });
  }
};

// Patient: View Appointment History /appointments/patient/history
export const getAppointmentHistoryForPatient = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({ msg: "Only patients allowed" });

  const today = new Date().toISOString().split("T")[0];

  try {
    // Find patient profile by user ID
    const patientProfile = await PatientProfile.findOne({
      user: req.user.userId,
    });
    if (!patientProfile) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    const history = await Appointment.find({
      patient: patientProfile._id, // Use PatientProfile ID
      date: { $lt: today },
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name",
        },
        select: "specialization user",
      })
      .sort({ date: -1, time: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching history", err });
  }
};

// Doctor: View Upcoming Appointments /appointments/doctor/upcoming
export const getUpcomingAppointmentsForDoctor = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "doctor")
    return res.status(403).json({ msg: "Only doctors allowed" });

  const today = new Date().toISOString().split("T")[0];

  try {
    // Find doctor profile by user ID
    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.userId,
    });
    if (!doctorProfile) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctor: doctorProfile._id, // Use DoctorProfile ID
      date: { $gte: today },
      status: { $in: ["booked", "completed"] },
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name",
        },
        select: "age gender user",
      })
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching appointments", err });
  }
};

// Doctor: View Appointment History /appointments/doctor/history
export const getAppointmentHistoryForDoctor = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "doctor")
    return res.status(403).json({ msg: "Only doctors allowed" });

  const today = new Date().toISOString().split("T")[0];

  try {
    // Find doctor profile by user ID
    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.userId,
    });
    if (!doctorProfile) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const history = await Appointment.find({
      doctor: doctorProfile._id, // Use DoctorProfile ID
      date: { $lt: today },
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name",
        },
        select: "age gender user",
      })
      .sort({ date: -1, time: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching history", err });
  }
};

export const getAllAppointmentsForPatient = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({
      success: false,
      msg: "Only patients can view their appointments",
    });

  try {
    // Find patient profile by user ID
    const patientProfile = await PatientProfile.findOne({
      user: req.user.userId,
    });
    if (!patientProfile) {
      return res.status(404).json({
        success: false,
        msg: "Patient profile not found. Please complete your profile first.",
      });
    }

    // Get all appointments for this patient
    const appointments = await Appointment.find({
      patient: patientProfile._id,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "specialization user",
      })
      .sort({ date: -1, time: -1 }); // Latest first

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "No appointments found",
        data: [],
      });
    }

    // Transform data for frontend appointment cards
    const transformedAppointments = appointments.map((appointment) => {
      // Format date (convert YYYY-MM-DD to readable format)
      const appointmentDate = new Date(appointment.date);
      const formattedDate = appointmentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Format time (convert HH:mm to HH:mm AM/PM)
      const [hours, minutes] = appointment.time.split(":").map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes);
      const formattedTime = timeDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: appointment._id,
        doctorName: `Dr. ${(appointment.doctor as any)?.user?.name || "Unknown Doctor"}`,
        specialization:
          (appointment.doctor as any)?.specialization ||
          "Unknown Specialization",
        date: formattedDate, // e.g., "November 15, 2023"
        time: formattedTime, // e.g., "10:00 AM"
        type: "In Person", // You can make this dynamic based on your schema
        reasonForVisit: appointment.symptoms.join(", "), // Join multiple symptoms
        status: appointment.status,
        rawDate: appointment.date, // Keep original date for sorting/filtering
        rawTime: appointment.time, // Keep original time
        createdAt: appointment.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      msg: "Appointments fetched successfully",
      data: transformedAppointments,
    });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({
      success: false,
      msg: "Error fetching appointments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get appointments by status for patient
export const getAppointmentsByStatusForPatient = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({
      success: false,
      msg: "Only patients can view their appointments",
    });

  const { status } = req.params; // booked, completed, cancelled

  // Validate status
  const validStatuses = ["booked", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid status. Valid statuses are: booked, completed, cancelled",
    });
  }

  try {
    // Find patient profile by user ID
    const patientProfile = await PatientProfile.findOne({
      user: req.user.userId,
    });
    if (!patientProfile) {
      return res.status(404).json({
        success: false,
        msg: "Patient profile not found. Please complete your profile first.",
      });
    }

    const appointments = await Appointment.find({
      patient: patientProfile._id,
      status: status,
    })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "specialization user",
      })
      .sort({ date: -1, time: -1 });

    // Transform data
    const transformedAppointments = appointments.map((appointment) => ({
      id: appointment._id,
      doctorName: (appointment.doctor as any)?.user?.name || "Unknown Doctor",
      doctorEmail: (appointment.doctor as any)?.user?.email || "Unknown Email",
      specialization:
        (appointment.doctor as any)?.specialization || "Unknown Specialization",
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      symptoms: appointment.symptoms,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }));

    res.status(200).json({
      success: true,
      msg: `${status.charAt(0).toUpperCase() + status.slice(1)} appointments fetched successfully`,
      data: {
        appointments: transformedAppointments,
        total: transformedAppointments.length,
        status: status,
      },
    });
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    res.status(500).json({
      success: false,
      msg: "Error fetching appointments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cancel appointment for patient
export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "patient")
    return res.status(403).json({
      success: false,
      msg: "Only patients can cancel their appointments",
    });

  const { appointmentId } = req.params;

  try {
    // Find patient profile
    const patientProfile = await PatientProfile.findOne({
      user: req.user.userId,
    });
    if (!patientProfile) {
      return res.status(404).json({
        success: false,
        msg: "Patient profile not found",
      });
    }

    // Find and update appointment
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: appointmentId,
        patient: patientProfile._id,
        status: "booked", // Can only cancel booked appointments
      },
      { status: "cancelled" },
      { new: true }
    ).populate({
      path: "doctor",
      populate: {
        path: "user",
        select: "name",
      },
      select: "specialization user",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found or cannot be cancelled",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Appointment cancelled successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({
      success: false,
      msg: "Error cancelling appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};





