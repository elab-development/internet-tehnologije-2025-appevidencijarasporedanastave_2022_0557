import * as attendanceService from '../services/attendence.service.js';
import { success, error } from '../utils/response.js'

export const markAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { termId, status } = req.body;

    const attendance = await attendanceService.markAttendance(
      userId,
      termId,
      status
    );

    return success(res, attendance, "Attendance recorded");
  } catch (err) {
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

