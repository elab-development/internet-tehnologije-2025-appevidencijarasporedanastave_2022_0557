import prisma from "../utils/prisma.js";

export const markAttendance = async (userId, termId, status) => {
  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_termId: {
        userId,
        termId,
      },
    },
  });
  if (!attendance)
    throw new Error("Attendance record does not exist for this term");

  return prisma.attendance.update({
    where: {
      userId_termId: {
        userId,
        termId,
      },
    },
    data: {
      status: status,
      checkedInAt: new Date(),
    },
  });
};

export const getByStudent = (userId) => {
  return prisma.attendance.findMany({
    where: { userId },
    orderBy: { checkedInAt: "desc" },
  });
};
