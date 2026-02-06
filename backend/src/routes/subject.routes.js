import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import { getAllSubjects } from "../controllers/subject.controller.js";

const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getAllSubjects);

export default router;
