-- CreateTable
CREATE TABLE "Student" (
    "rollNumber" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "classNumber" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "contactDetails" TEXT NOT NULL,
    "schoolClassId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("rollNumber")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contactDetails" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolClass" (
    "id" SERIAL NOT NULL,
    "class" INTEGER NOT NULL,
    "section" TEXT NOT NULL,

    CONSTRAINT "SchoolClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingAssignment" (
    "id" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "schoolClassId" INTEGER NOT NULL,

    CONSTRAINT "TeachingAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolClass_class_section_key" ON "SchoolClass"("class", "section");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeachingAssignment_teacherId_subjectId_schoolClassId_key" ON "TeachingAssignment"("teacherId", "subjectId", "schoolClassId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolClassId_fkey" FOREIGN KEY ("schoolClassId") REFERENCES "SchoolClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignment" ADD CONSTRAINT "TeachingAssignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignment" ADD CONSTRAINT "TeachingAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingAssignment" ADD CONSTRAINT "TeachingAssignment_schoolClassId_fkey" FOREIGN KEY ("schoolClassId") REFERENCES "SchoolClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
