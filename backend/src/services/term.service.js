import prisma from "../utils/prisma.js";

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
