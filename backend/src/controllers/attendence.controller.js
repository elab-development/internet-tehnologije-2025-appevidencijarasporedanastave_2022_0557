import * as attendanceService from "../services/attendence.service.js";
import { success, error } from "../utils/response.js";

export const markAttendance = async (req, res) => {
  try {
    console.log("=== Incoming PATCH /attendance/:termId ===");
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const userId = req.user.id;
    const termId = parseInt(req.params.termId);
    const { status } = req.body;

    const attendance = await attendanceService.markAttendance(
      userId,
      termId,
      status
    );

    return success(res, attendance, `Attendance marked as ${status}`);
  } catch (err) {
    console.log("Error in markAttendance:", err.message);
    return error(res, err.message);
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendance = await attendanceService.getByStudent(studentId);

    return success(res, attendance);
  } catch (err) {
    return error(res, err.message);
  }
};
