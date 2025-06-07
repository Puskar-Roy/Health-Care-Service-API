import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { corsOptions, limiter } from "./util/utils";
import config from "./config/config";
import CheckError from "./util/checkError";
import errorHandler from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import { AccessToken } from "livekit-server-sdk";

const app: Express = express();

app.use(config.DEV_ENV === 'PROD' ? cors(corsOptions) : cors());
app.set("trust proxy", config.DEV_ENV === "PROD" ? true : false);
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());

app.use(limiter);

import "./database/connectDb";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointment", appointmentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "API IS WORKING 🥳" });
});
app.post("/getToken", async (req, res) => {
  const { participantName, roomName } = req.body;
  console.log('calling bro');
  
  if (!participantName || !roomName) {
    return res.status(400).json({ message: "Name and room required." });
  }

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      name: participantName,
    }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await token.toJwt();
  console.log(jwt);
  
  res.json({ token: jwt });
});
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new CheckError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`[🤖] Server Is Running on http://localhost:${config.PORT}`);
});

export default app;

