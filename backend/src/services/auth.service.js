import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";

export const loginUser = async (email, password) => {
  console.log("Password iz requesta:", password);
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("User iz baze:", user);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  console.log("Hash iz baze:", user.password);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
};
