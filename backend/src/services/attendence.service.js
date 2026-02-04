import prisma from "../utils/prisma.js";

export const markAttendance = async (userId, termId, status) => {
  const existing = await prisma.attendance.findFirst({
    where: {
      userId,
      termId
    }
  });

  if (existing) {
    throw new Error("Attendance already marked for this term");
  }

  return prisma.attendance.create({
    data: {
      userId,
      termId,
      status
    }
  });
};


export const getByStudent = (userId) => {
  return prisma.attendance.findMany({
    where: { userId},
    orderBy: { checkedInAt: "desc" }
  });
};


