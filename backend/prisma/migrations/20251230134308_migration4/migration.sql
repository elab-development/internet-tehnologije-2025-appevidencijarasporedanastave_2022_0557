/*
  Warnings:

  - You are about to drop the column `professorId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `professorId` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'NOT_SELECTED';

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_professorId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "professorId";

-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "professorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Enrollment";

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
