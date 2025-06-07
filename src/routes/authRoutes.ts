import express, { Router } from 'express';
import { doctorLogin , patientLogin , register } from '../controllers/authController';
const router: Router = express.Router();

router.post('/login/patient', patientLogin);
router.post("/login/doctor",doctorLogin);
router.post('/register', register);

export default router;
