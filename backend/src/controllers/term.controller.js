import * as termService from "../services/term.service.js";
import * as userService from "../services/user.service.js";
import { success, error } from "../utils/response.js";

import { getPresentCountForTerm } from "../services/term.service.js";

export const getPresentCountController = async (req, res) => {
  try {
    const { id } = req.params;

    const presentCount = await getPresentCountForTerm(id);

    return res.status(200).json({
      success: true,
      data: {
        present: presentCount,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message || "Failed to fetch present count",
    });
  }
};

export const createTerm = async (req, res) => {
  try {
    const term = await termService.createTermWithAttendance(req.body);
    return success(res, term, "Term created successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getMyTerms = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    let terms;
    if (user.role === "STUDENT") {
      terms = await termService.getStudentTerms(user.idGroup, user.id);
    } else if (user.role === "PROFESSOR") {
      terms = await termService.getProfessorTerms(user.id);
    } else {
      return error(res, "Role not supported for this action", 403);
    }

    return success(res, terms, "Terms fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};
