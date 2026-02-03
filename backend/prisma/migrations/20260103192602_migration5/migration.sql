/*
  Warnings:

  - Added the required column `idGroup` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "idGroup" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "idGroup" INTEGER;

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);
