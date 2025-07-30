import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";
import { PatientProfile } from "../models/PatientProfile";
import { AuthRequest } from "../middleware/middleware";
import { User } from "../models/userSchema";

export const getUpcomingAppointmentsForDoctor = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "doctor")
    return res.status(403).json({
      success: false,
      msg: "Only doctors can view their appointments",
    });
console.log(req.user);

  try {
    // Find doctor profile by user ID
    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.userId,
    });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        msg: "Doctor profile not found. Please complete your profile first.",
      });
    }

    

    // Get current date for filtering upcoming appointments
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Get all upcoming appointments for this doctor
    const appointments = await Appointment.find({
      doctor: doctorProfile._id,
      date: { $gte: today }, // Today and future dates
      status: { $in: ["booked"] }, // Only active appointments
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "age gender bloodGroup medicalHistory user",
      })
      .sort({ date: 1, time: 1 }); // Earliest first

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "No upcoming appointments found",
        data: [],
      });
    }

    // Transform data for frontend
    const transformedAppointments = appointments.map((appointment) => {
      // Format date
      const appointmentDate = new Date(appointment.date);
      const formattedDate = appointmentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });

      // Format time
      const [hours, minutes] = appointment.time.split(":").map(Number);
      const timeDate = new Date();
      timeDate.setHours(hours, minutes);
      const formattedTime = timeDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const patient = appointment.patient as any;

      return {
        appointmentId: appointment._id,
        patientId: patient?._id,
        patientName: patient?.user?.name || "Unknown Patient",
        patientEmail: patient?.user?.email || "Unknown Email",
        patientAge: patient?.age || "N/A",
        patientGender: patient?.gender || "N/A",
        patientBloodGroup: patient?.bloodGroup || "N/A",
        patientMedicalHistory: patient?.medicalHistory || [],
        date: formattedDate, // e.g., "Monday, July 21, 2025"
        time: formattedTime, // e.g., "10:00 AM"
        reasonForVisit: appointment.symptoms.join(", "),
        status: appointment.status,
        rawDate: appointment.date,
        rawTime: appointment.time,
        createdAt: appointment.createdAt,
      };
    });

    // Group appointments by date for better organization
    const groupedByDate = transformedAppointments.reduce(
      (acc, appointment) => {
        const dateKey = appointment.rawDate;
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: appointment.date,
            appointments: [],
          };
        }
        acc[dateKey].appointments.push(appointment);
        return acc;
      },
      {} as Record<string, { date: string; appointments: any[] }>
    );

    const groupedAppointments = Object.values(groupedByDate);

    res.status(200).json({
      success: true,
      msg: "Upcoming appointments fetched successfully",
      data: {
        appointments: transformedAppointments,
        groupedByDate: groupedAppointments,
        totalAppointments: transformedAppointments.length,
        doctorName: `${req.user.name || "Unknown"}`,
        doctorEmail: `${req.user.email || "Unknown"}`,
        specialization: doctorProfile.specialization,
      },
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({
      success: false,
      msg: "Error fetching appointments",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get specific appointment details for doctor
export const getAppointmentDetailsForDoctor = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "doctor")
    return res.status(403).json({
      success: false,
      msg: "Only doctors can view appointment details",
    });

  const { appointmentId } = req.params;

  try {
    // Find doctor profile
    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.userId,
    });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        msg: "Doctor profile not found",
      });
    }

    // Get specific appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorProfile._id,
    }).populate({
      path: "patient",
      populate: {
        path: "user",
        select: "name email",
      },
      select: "age gender bloodGroup height weight medicalHistory user",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found",
      });
    }

    const patient = appointment.patient as any;

    const appointmentDetails = {
      appointmentId: appointment._id,
      patient: {
        id: patient?._id,
        name: patient?.user?.name || "Unknown Patient",
        email: patient?.user?.email || "Unknown Email",
        age: patient?.age || "N/A",
        gender: patient?.gender || "N/A",
        bloodGroup: patient?.bloodGroup || "N/A",
        height: patient?.height || "N/A",
        weight: patient?.weight || "N/A",
        medicalHistory: patient?.medicalHistory || [],
      },
      appointment: {
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        symptoms: appointment.symptoms,
        createdAt: appointment.createdAt,
      },
    };

    res.status(200).json({
      success: true,
      msg: "Appointment details fetched successfully",
      data: appointmentDetails,
    });
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({
      success: false,
      msg: "Error fetching appointment details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Mark appointment as completed
export const markAppointmentCompleted = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "doctor")
    return res.status(403).json({
      success: false,
      msg: "Only doctors can mark appointments as completed",
    });

  const { appointmentId } = req.params;

  try {
    // Find doctor profile
    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.userId,
    });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        msg: "Doctor profile not found",
      });
    }

    // Update appointment status
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: appointmentId,
        doctor: doctorProfile._id,
        status: "booked", // Can only complete booked appointments
      },
      { status: "completed" },
      { new: true }
    ).populate({
      path: "patient",
      populate: {
        path: "user",
        select: "name",
      },
      select: "user",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found or cannot be completed",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Appointment marked as completed successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    res.status(500).json({
      success: false,
      msg: "Error updating appointment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
