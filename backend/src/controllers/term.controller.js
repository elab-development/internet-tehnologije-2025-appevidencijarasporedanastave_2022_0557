import * as termService from "../services/term.service.js";
import * as userService from "../services/user.service.js";
import { success, error } from "../utils/response.js";

export const getMyTerms = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    let terms;
    if (user.role === "STUDENT") {
      terms = await termService.getStudentTerms(user.idGroup,user.id);
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
