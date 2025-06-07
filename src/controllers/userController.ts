import { Request, Response } from "express";
import { DoctorProfile } from "../models/DoctorProfile";
import { PatientProfile } from "../models/PatientProfile";
import { AuthRequest } from "../middleware/middleware";

export const editDoctorProfile = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "doctor") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const { specialization, slots } = req.body;

  try {
    const profile = await DoctorProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    if (specialization) profile.specialization = specialization;
    if (slots) profile.slots = slots;

    await profile.save();
    res.json({ msg: "Doctor profile updated", profile });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};

export const editPatientProfile = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "patient") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const { age, gender, medicalHistory } = req.body;

  try {
    const profile = await PatientProfile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    if (age) profile.age = age;
    if (gender) profile.gender = gender;
    if (medicalHistory) profile.medicalHistory = medicalHistory;

    await profile.save();
    res.json({ msg: "Patient profile updated", profile });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};