import prisma from "../utils/prisma.js";

export const markAttendance = async (userId, termId) => {
  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_termId: {
        userId,
        termId
      }
    }
  });

  if (!attendance) {
    throw new Error('Attendance record does not exist for this term');
  }

  if (attendance.status === 'PRESENT') {
    throw new Error('Attendance already marked as PRESENT');
  }

  return prisma.attendance.update({
    where: {
      userId_termId: {
        userId,
        termId
      }
    },
    data: {
      status: 'PRESENT',
      checkedInAt: new Date()
    }
  });
};


export const getByStudent = (userId) => {
  return prisma.attendance.findMany({
    where: { userId},
    orderBy: { checkedInAt: "desc" }
  });
};


