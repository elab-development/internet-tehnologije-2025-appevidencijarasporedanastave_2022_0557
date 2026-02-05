-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "Term" DROP CONSTRAINT "Term_professorId_fkey";

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
