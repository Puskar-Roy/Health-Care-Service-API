import express, { Router } from 'express';
import { editDoctorProfile , editPatientProfile } from '../controllers/userController';
import { authorizeRoles, authMiddleware } from '../middleware/middleware';

const router: Router = express.Router();

router.put("/doctor/edit", authMiddleware, authorizeRoles('doctor'), editDoctorProfile);
router.put("/patient/edit", authMiddleware, authorizeRoles('patient'), editPatientProfile);

export default router;
