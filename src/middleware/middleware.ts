// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// export interface AuthRequest extends Request {
//   user?: { userId: string; role: "doctor" | "patient" };
// }

// export const authMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     req.user = { userId: decoded._id, role: decoded.role };
//     next();
//   } catch {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

// export const authorizeRoles = (...allowedRoles: ("doctor" | "patient")[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user || !allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ msg: "Access denied" });
//     }
//     next();
//   };
// };




import { Request, Response, NextFunction } from "express";
import { User } from "../models/userSchema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "doctor" | "patient";
    name?: string; // Add name property
    email?: string; // Add email property if needed
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });
  

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
     const doctorData = await User.findOne({
            _id : decoded._id
      });
    req.user = {
      userId: decoded._id,
      role: decoded.role,
      name: doctorData.name, // Include name from token
      email: doctorData.email, // Include email if needed
    };
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const authorizeRoles = (...allowedRoles: ("doctor" | "patient")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};
