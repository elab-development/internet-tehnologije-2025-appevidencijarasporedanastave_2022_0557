import prisma from '../utils/prisma.js'
import bcrypt from "bcrypt";

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      role: true,
      studentIndex: true,
      studyYear: true,
      idGroup: true,
      createdAt: true
    }
  });
};


export const updateUser = async (userId, data) => {
  const updateData = {};
  const id = Number(userId);

  if (data.firstName) updateData.firstName = data.firstName;
  if (data.lastName) updateData.lastName = data.lastName;
  if (data.email) updateData.email = data.email;
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const deleteUser = async (userId) => {
  const id = Number(userId);
  await prisma.user.delete({
    where: { id },
  });
};

export const searchUsers = async ({ role, name }) => {
  return prisma.user.findMany({
    where: {
      role,
      ...(name && {
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } }
        ]
      })
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true
    }
  });
};
