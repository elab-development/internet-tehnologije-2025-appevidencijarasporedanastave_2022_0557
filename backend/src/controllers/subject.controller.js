import * as subjectService from "../services/subject.service.js";
import { success, error } from "../utils/response.js";

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    return success(res, subjects, "Subjects fetched successfully");
  } catch (err) {
    return error(res, err.message);
  }
};