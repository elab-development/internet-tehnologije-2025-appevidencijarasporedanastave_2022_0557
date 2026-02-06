import express from "express";
import {
  updateMyAccount,
  updateUserByAdmin,
  deleteAccount,
  searchUsers,
  getMyProfile,
  getAllUsers,
  createUser,
  getAllProfessors,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.put("/me", authenticate, updateMyAccount);
router.put("/:id", authenticate, authorizeAdmin, updateUserByAdmin);
router.delete("/:id", authenticate, authorizeAdmin, deleteAccount);

router.get("/search", authenticate, authorizeAdmin, searchUsers);

router.get("/me", authenticate, getMyProfile);
router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.get("/professors", authenticate, authorizeAdmin, getAllProfessors);

router.post("/", authenticate, authorizeAdmin, createUser);

export default router;
