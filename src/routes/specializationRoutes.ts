import { Router } from "express";
import {
  getAllSpecializations,
  getDoctorsBySpecialization,
  getDoctorAvailableSlots
} from "../controllers/specializationController"; 

const router = Router();

// GET /api/specializations
router.get("/", getAllSpecializations);

// GET /api/specializations/:specialization/doctors
router.get("/:specialization/doctors", getDoctorsBySpecialization);
// GET /api/specializations/doctor/:userid/available-slots?date=YYYY-MM-DD
router.get("/doctor/:userid/available-slots", getDoctorAvailableSlots);
export default router;
