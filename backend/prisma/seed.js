import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");

  // Hashujemo lozinke
  const adminPassword = await bcrypt.hash("admin123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);
  const professorPassword = await bcrypt.hash("prof123", 10);

  // ADMIN
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // STUDENT
  await prisma.user.upsert({
    where: { username: "pera" },
    update: {},
    create: {
      firstName: "Pera",
      lastName: "Peric",
      email: "peraperic@gmail.com",
      username: "pera",
      password: studentPassword,
      role: "STUDENT",
      studentIndex: "2023/001",
      studyYear: 1,
      idGroup: 1,
    },
  });

  // PROFESSOR
  await prisma.user.upsert({
    where: { username: "laza" },
    update: {},
    create: {
      firstName: "Laza",
      lastName: "Lazic",
      email: "lazalazic@gmail.com",
      username: "laza",
      password: professorPassword,
      role: "PROFESSOR",
    },
  });

  console.log("Admin, Student and Professor seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });