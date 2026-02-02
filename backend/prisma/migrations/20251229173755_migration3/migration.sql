/*
  Warnings:

  - You are about to drop the column `code` on the `Subject` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subject_code_key";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "code";
