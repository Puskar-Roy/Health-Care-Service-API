import express from "express";
import { authMiddleware } from "../middleware/middleware";
import {
  getUpcomingAppointmentsForPatient,
  getAppointmentHistoryForPatient,
  getAppointmentHistoryForDoctor,
  bookAppointment,
  getAvailableSlots,
  getAllAppointmentsForPatient,
  getAppointmentsByStatusForPatient,
  cancelAppointment
} from "../controllers/appointmentController";
import {
  getAppointmentDetailsForDoctor,getUpcomingAppointmentsForDoctor,markAppointmentCompleted
} from "../controllers/doctorAppointment";
const router = express.Router();

router.get(
  "/patient/upcoming",
  authMiddleware,
  getUpcomingAppointmentsForPatient
);
router.get("/patient/history", authMiddleware, getAppointmentHistoryForPatient);
// router.get(
//   "/doctor/upcoming/ok",
//   authMiddleware,
//   getUpcomingAppointmentsForDoctor
// );
// router.get("/doctor/history", authMiddleware, getAppointmentHistoryForDoctor);
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

router.get("/patient/all", authMiddleware, getAllAppointmentsForPatient);
router.get(
  "/patient/status/:status",
  authMiddleware,
  getAppointmentsByStatusForPatient
);
router.patch(
  "/patient/cancel/:appointmentId",
  authMiddleware,
  cancelAppointment
);
// Doctor routes
router.get(
  "/doctor/upcoming",
  authMiddleware,
  getUpcomingAppointmentsForDoctor
);
router.get(
  "/doctor/details/:appointmentId",
  authMiddleware,
  getAppointmentDetailsForDoctor
);
router.patch(
  "/doctor/complete/:appointmentId",
  authMiddleware,
  markAppointmentCompleted
);

export default router;
