import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";

export const getAllUsers = () => {
  return prisma.user.findMany({
    where: {
      role: {
        not: 'ADMIN'
      }
    },
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
      createdAt: true,
    },
  });
};

export const createUser = async (data) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    role,
    studentIndex,
    studyYear,
    idGroup
  } = data;

  if (!firstName || !lastName || !email || !username || !password || !role) {
    throw new Error('Missing required fields');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role,
      studentIndex: role === 'STUDENT' ? studentIndex : null,
      studyYear: role === 'STUDENT' ? studyYear : null,
      idGroup: role === 'STUDENT' ? idGroup : null
    },
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
      createdAt: true,
    },
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
          { firstName: { contains: name, mode: "insensitive" } },
          { lastName: { contains: name, mode: "insensitive" } },
        ],
      }),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });
};
