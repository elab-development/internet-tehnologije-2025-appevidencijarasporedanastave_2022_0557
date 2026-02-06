import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMyTerms } from "../controllers/term.controller.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";
import { createTerm } from "../controllers/term.controller.js";
import { getPresentCountController } from "../controllers/term.controller.js";

const router = express.Router();

router.get("/my", authenticate, getMyTerms);
router.post("/", authenticate, authorizeAdmin, createTerm);
router.get("/:id/stats", authenticate, getPresentCountController);

export default router;
