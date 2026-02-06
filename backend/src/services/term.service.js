import prisma from "../utils/prisma.js";

export const getPresentCountForTerm = async (termId) => {
  const term = await prisma.term.findUnique({
    where: { id: Number(termId) },
    select: { id: true },
  });

  if (!term) {
    throw new Error("Term not found");
  }

  const presentCount = await prisma.attendance.count({
    where: {
      termId: term.id,
      status: "PRESENT",
    },
  });

  return presentCount;
};

export const createTermWithAttendance = async (data) => {
  const {
    subjectId,
    professorId,
    date,
    startTime,
    endTime,
    classroom,
    type,
    idGroup,
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
        idGroup,
      },
    });

    const students = await tx.user.findMany({
      where: {
        role: "STUDENT",
        idGroup,
      },
      select: { id: true },
    });

    if (students.length > 0) {
      await tx.attendance.createMany({
        data: students.map((student) => ({
          userId: student.id,
          termId: term.id,
          status: "NOT_SELECTED",
        })),
      });
    }

    return term;
  });
};

export const getStudentTerms = async (groupId, userId) => {
  console.log("groupid is = " + groupId);
  if (!groupId) return [];

  return prisma.attendance.findMany({
    where: {
      userId,
      term: {
        idGroup: groupId,
      },
    },
    include: {
      term: {
        include: {
          subject: {
            select: {
              name: true,
            },
          },
        },
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
