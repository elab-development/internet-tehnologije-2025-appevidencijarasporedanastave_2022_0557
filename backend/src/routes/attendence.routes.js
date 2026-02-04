import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {markAttendance,getMyAttendance} from "../controllers/attendence.controller.js"

const router = express.Router();

router.patch("/:termId",authenticate,markAttendance);

router.get("/me", authenticate, getMyAttendance);

export default router;
