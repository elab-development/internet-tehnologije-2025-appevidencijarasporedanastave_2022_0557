import prisma from "../utils/prisma.js";

export const getAllSubjects = () => {
  return prisma.subject.findMany({
    select: {
      id: true,
      name: true,
      espb: true,
    },
  });
};