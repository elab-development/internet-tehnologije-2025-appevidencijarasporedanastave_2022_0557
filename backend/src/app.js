import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import termRoutes from "./routes/term.routes.js";
import attendanceRoutes from "./routes/attendence.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/terms", termRoutes);
app.use("/api/attendence", attendanceRoutes);

export default app;
