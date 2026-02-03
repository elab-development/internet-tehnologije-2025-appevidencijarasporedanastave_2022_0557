import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import { getMyTerms } from "../controllers/term.controller.js";

const router = express.Router();

router.get("/my", authenticate, getMyTerms);

export default router;
