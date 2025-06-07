import { Request, Response } from "express";
import asyncHandler from "../util/catchAsync";
import { User } from "../models/userSchema";
import { PatientProfile } from "../models/PatientProfile";
import { DoctorProfile } from "../models/DoctorProfile";

import bcrypt from "bcryptjs";
import validator from "validator";
import { createToken } from "../util/utils";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, specialization, age, gender } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, and role are required",
    });
  }

  if (role === "doctor" && !specialization) {
    return res.status(400).json({
      success: false,
      message: "Specialization is required for doctor registration",
    });
  }
  if (role === "patient" && (!age || !gender)) {
    return res.status(400).json({
      success: false,
      message: "Age and gender are required for patient registration",
    });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashed, role });
    if (!user) {
      throw new Error("Failed to create user");
    }

    if (role === "doctor") {
      await DoctorProfile.create({
        user: user._id,
        specialization,
        slots: [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "12:00",
            slotDuration: 15,
          },
          {
            day: "Tuesday",
            startTime: "13:00",
            endTime: "15:00",
            slotDuration: 15,
          },
          {
            day: "Saturday",
            startTime: "09:00",
            endTime: "12:00",
            slotDuration: 15,
          },
          {
            day: "Sunday",
            startTime: "16:00",
            endTime: "18:00",
            slotDuration: 15,
          },
        ],
      });
    } else if (role === "patient") {
      await PatientProfile.create({
        user: user._id,
        age,
        gender,
        medicalHistory: [],
      });
    } else {
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const token = createToken({ _id: user._id.toString(), role: user.role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        //@ts-ignore
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later.",
    });
  }
});

// export const login = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     throw Error('All fields must be filled');
//   }
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       throw Error('Email is not valid');
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       throw Error('Invalid credentials');
//     }

//     const token = createToken(user._id.toString());
//     res.status(200).json({
//       message: 'Login successful!',
//       success: true,
//       token: token,
//       email: user.email,
//       role: user.role,
//       id: user._id,
//     });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

export const patientLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

 
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    
    const user = await User.findOne({ email, role: "patient" }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password, or user type",
      });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password, or user type",
      });
    }

    
    const patientProfile = await PatientProfile.findOne({ user: user._id });
    if (!patientProfile) {
      return res.status(500).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    
    const token = createToken({ _id: user._id.toString(), role: user.role });

   
    res.status(200).json({
      success: true,
      message: "Patient login successful",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: {
            age: patientProfile.age,
            gender: patientProfile.gender,
            medicalHistory: patientProfile.medicalHistory,
          },
        },
      },
    });
  } catch (error) {
    
    console.error("Patient login error:", error);

   
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        //@ts-ignore
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
});

export const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {

    const user = await User.findOne({ email, role: "doctor" }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password, or user type",
      });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password, or user type",
      });
    }

    
    const doctorProfile = await DoctorProfile.findOne({ user: user._id });
    if (!doctorProfile) {
      return res.status(500).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

  
    const token = createToken({ _id: user._id.toString(), role: user.role });

   
    res.status(200).json({
      success: true,
      message: "Doctor login successful",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: {
            specialization: doctorProfile.specialization,
            slots: doctorProfile.slots,
          },
        },
      },
    });
  } catch (error) {
    
    console.error("Doctor login error:", error);

 
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        //@ts-ignore
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
});