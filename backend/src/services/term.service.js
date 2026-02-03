import prisma from "../utils/prisma.js";

export const getStudentTerms = async (groupId) => {
  console.log("groupd id is = " + groupId);
  if (!groupId) return [];

  return prisma.term.findMany({
    where: {
      idGroup: groupId,
    },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      professor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      date: "asc",
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
