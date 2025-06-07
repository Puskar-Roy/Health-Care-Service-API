import express from "express";
import { authMiddleware } from "../middleware/middleware";
import {
  getUpcomingAppointmentsForPatient,
  getAppointmentHistoryForPatient,
  getUpcomingAppointmentsForDoctor,
  getAppointmentHistoryForDoctor,
  bookAppointment,
  getAvailableSlots
} from "../controllers/appointmentController";

const router = express.Router();

router.get(
  "/patient/upcoming",
  authMiddleware,
  getUpcomingAppointmentsForPatient
);
router.get("/patient/history", authMiddleware, getAppointmentHistoryForPatient);
router.get(
  "/doctor/upcoming",
  authMiddleware,
  getUpcomingAppointmentsForDoctor
);
router.get("/doctor/history", authMiddleware, getAppointmentHistoryForDoctor);
router.post("/book", authMiddleware, bookAppointment);
// Exp body
// {
//           "doctorId": "66401f47dca1f1f9e4d4ad9a",
//           "date": "2025-06-08",
//           "time": "09:00",
//           "symptoms": ["6645c1a95d44b879238c91d1"]
//         }
        
router.get("/doctor/:id/available-slots", authMiddleware, getAvailableSlots);
// Exp - 
// /doctor/:id/available-slots?date=2025-06-08
export default router;
