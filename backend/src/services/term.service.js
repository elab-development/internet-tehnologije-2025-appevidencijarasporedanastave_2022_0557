import prisma from "../utils/prisma.js";

export const createTermWithAttendance = async (data) => {
  const {
    subjectId,
    professorId,
    date,
    startTime,
    endTime,
    classroom,
    type,
    idGroup
  } = data;

  return prisma.$transaction(async (tx) => {
    const term = await tx.term.create({
      data: {
        subjectId,
        professorId,
        date,
        startTime,
        endTime,
        classroom,
        type,
        idGroup
      }
    });

    const students = await tx.user.findMany({
      where: {
        role: 'STUDENT',
        idGroup
      },
      select: { id: true }
    });

    if (students.length > 0) {
      await tx.attendance.createMany({
        data: students.map(student => ({
          userId: student.id,
          termId: term.id,
          status: 'NOT_SELECTED'
        }))
      });
    }

    return term;
  });
};

export const getStudentTerms = async (groupId,userId) => {
  console.log("groupd id is = " + groupId);
  if (!groupId) return [];

  return prisma.attendance.findMany({
    where: {
      userId,
      term: {
        idGroup: groupId,
      },
    },
  });
};

export const getProfessorTerms = async (professorId) => {
  return prisma.term.findMany({
    where: {
      professorId,
    },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};
