/*
  Warnings:

  - You are about to drop the column `class` on the `SchoolClass` table. All the data in the column will be lost.
  - You are about to drop the column `classNumber` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classNumber,section]` on the table `SchoolClass` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactDetails]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,contactDetails]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactDetails]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,contactDetails]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classNumber` to the `SchoolClass` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `contactDetails` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `contactDetails` on the `Teacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "SchoolClass_class_section_key";

-- AlterTable
ALTER TABLE "SchoolClass" DROP COLUMN "class",
ADD COLUMN     "classNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "classNumber",
DROP COLUMN "section",
DROP COLUMN "contactDetails",
ADD COLUMN     "contactDetails" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "contactDetails",
ADD COLUMN     "contactDetails" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SchoolClass_classNumber_section_key" ON "SchoolClass"("classNumber", "section");

-- CreateIndex
CREATE UNIQUE INDEX "Student_contactDetails_key" ON "Student"("contactDetails");

-- CreateIndex
CREATE UNIQUE INDEX "Student_name_contactDetails_key" ON "Student"("name", "contactDetails");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_contactDetails_key" ON "Teacher"("contactDetails");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_name_contactDetails_key" ON "Teacher"("name", "contactDetails");
