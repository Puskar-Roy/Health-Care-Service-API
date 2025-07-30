import { Request, Response } from "express";
import { DoctorProfile } from "../models/DoctorProfile";
import { Appointment } from "../models/Appointment";

export const getAllSpecializations = async (req: Request, res: Response) => {
  try {
    const specializations = await DoctorProfile.distinct("specialization");

    if (!specializations || specializations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No specializations found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Specializations fetched successfully",
      data: specializations,
    });
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDoctorsBySpecialization = async (
  req: Request,
  res: Response
) => {
  try {
    const { specialization } = req.params;

    if (!specialization) {
      return res.status(400).json({
        success: false,
        message: "Specialization parameter is required",
      });
    }

    const doctors = await DoctorProfile.find({
      specialization: { $regex: new RegExp(specialization, "i") },
    })
      .populate("user", "name email _id") // Include _id in populate
      .select("_id user specialization");

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No doctors found for specialization: ${specialization}`,
        data: [],
      });
    }

    const doctorsMap = doctors.map((doctor) => ({
      id: doctor._id,
      userId: (doctor.user as any)?._id || null, // User ID added here
      name: (doctor.user as any)?.name || "Unknown",
      email: (doctor.user as any)?.email || "Unknown",
      specialization: doctor.specialization,
    }));

    res.status(200).json({
      success: true,
      message: `Doctors fetched successfully for ${specialization}`,
      data: doctorsMap,
      count: doctorsMap.length,
    });
  } catch (error) {
    console.error("Error fetching doctors by specialization:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};












export const getDoctorAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;
    const { date } = req.query;

    // Validate required parameters
    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "Doctor user ID is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    // Validate date format (assuming YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    // Find doctor profile by user ID
    const doctorProfile = await DoctorProfile.findOne({ user: userid });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // Get day name from date
    const selectedDate = new Date(date as string);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Find slots for the specific day
    const daySlots = doctorProfile.slots.filter(
      (slot) => slot.day.toLowerCase() === dayName.toLowerCase()
    );

    if (daySlots.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No slots available for ${dayName}`,
        data: {
          availableSlots: [],
          date: date,
          dayName: dayName,
        },
      });
    }

    // Get all booked appointments for this doctor on the specified date
    const bookedAppointments = await Appointment.find({
      doctor: doctorProfile._id,
      date: date as string,
      status: { $in: ["booked", "completed"] }, // Exclude cancelled appointments
    }).select("time");

    const bookedTimes = bookedAppointments.map(
      (appointment) => appointment.time
    );

    // Generate all possible time slots for the day
    const allAvailableSlots: string[] = [];

    daySlots.forEach((slot) => {
      const { startTime, endTime, slotDuration } = slot;

      // Parse start and end times
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startTimeMinutes = startHour * 60 + startMinute;
      const endTimeMinutes = endHour * 60 + endMinute;

      // Generate slots within the time range
      for (
        let currentTime = startTimeMinutes;
        currentTime < endTimeMinutes;
        currentTime += slotDuration
      ) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;

        const timeSlot = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        // Only add if not booked
        if (!bookedTimes.includes(timeSlot)) {
          allAvailableSlots.push(timeSlot);
        }
      }
    });

    // Check if the date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = selectedDate.getTime() === today.getTime();
    const isPastDate = selectedDate < today;

    // If it's today, filter out past time slots
    let finalAvailableSlots = allAvailableSlots;
    if (isToday) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      finalAvailableSlots = allAvailableSlots.filter((slot) => {
        const [slotHour, slotMinute] = slot.split(":").map(Number);
        const slotTimeInMinutes = slotHour * 60 + slotMinute;
        return slotTimeInMinutes > currentTimeInMinutes;
      });
    } else if (isPastDate) {
      finalAvailableSlots = []; // No slots for past dates
    }

    res.status(200).json({
      success: true,
      message: "Available slots fetched successfully",
      data: {
        availableSlots: finalAvailableSlots,
        bookedSlots: bookedTimes,
        date: date,
        dayName: dayName,
        doctorId: doctorProfile._id,
        totalAvailable: finalAvailableSlots.length,
        slotDuration: daySlots[0]?.slotDuration || 15,
      },
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
