import { BadRequestException, Injectable } from '@nestjs/common';
import { SchoolClass, Subject, Teacher } from '@prisma/client';

import { TeacherAssignmentDto } from './dtos/global.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async createTeacherAssignment(teacherAssignmentDto: TeacherAssignmentDto) {
    const {
      teacherName: name,
      contactDetails,
      subject,
      classNumber,
      section,
    } = teacherAssignmentDto;
    let teacherExists: Teacher | null;
    let classExists: SchoolClass | null;
    let subjectExists: Subject | null;

    // Teacher Logic
    teacherExists = await this.prismaService.teacher.findFirst({
      where: {
        contactDetails: contactDetails,
        name: {
          equals: name.toLowerCase(),
          mode: 'insensitive',
        },
      },
    });
    if (!teacherExists)
      teacherExists = await this.createTeacher(contactDetails, name);

    //Class Logic
    classExists = await this.prismaService.schoolClass.findFirst({
      where: {
        classNumber,
        section: {
          equals: section.toUpperCase(),
          mode: 'insensitive',
        },
      },
    });
    if (!classExists)
      classExists = await this.createClass(classNumber, section);

    //Subject Logic
    subjectExists = await this.prismaService.subject.findFirst({
      where: {
        name: {
          equals: subject.toLowerCase(),
          mode: 'insensitive',
        },
      },
    });
    if (!subjectExists) subjectExists = await this.createSubject(subject);

    const teacherAssignemnt =
      await this.prismaService.teachingAssignment.create({
        data: {
          teacherId: teacherExists.id,
          schoolClassId: classExists.id,
          subjectId: subjectExists.id,
        },
      });
    if (!teacherAssignemnt)
      throw new BadRequestException(
        'Something went wrong creating teacherAssignment',
      );
    return teacherAssignemnt;
  }

  async createTeacher(contactDetails: string, name: string) {
    const teacher = await this.prismaService.teacher.create({
      data: {
        contactDetails,
        name: name.toUpperCase(),
      },
    });
    if (!teacher)
      throw new BadRequestException('Something went wrong creating teacher');
    return teacher;
  }
  async createClass(classNumber: number, section: string) {
    const schoolClass = await this.prismaService.schoolClass.create({
      data: {
        classNumber,
        section: section.toUpperCase(),
      },
    });
    if (!schoolClass)
      throw new BadRequestException('Something went wrong creating class');

    return schoolClass;
  }
  async createSubject(name: string) {
    const subject = await this.prismaService.subject.create({
      data: {
        name: name.toUpperCase(),
      },
    });
    if (!subject)
      throw new BadRequestException('Something went wrong creating subject');
    return subject;
  }

  async dashboard() {
    const schoolClass = await this.prismaService.schoolClass.findMany({
      include: {
        students: true,
        assignments: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
    });
    const dashBoard = schoolClass.map((singleClass) => {
      const schoolClass = (
        singleClass.classNumber.toString() + singleClass.section
      ).toString();
      const newId = schoolClass.concat('_id');
      const total = singleClass.students.length;
      const subjects = singleClass.assignments.map((assignment) => {
        return {
          subject: assignment.subject.name,
          teacher: assignment.teacher.name,
        };
      });
      const toReturnObj = {
        [newId]: {
          class: schoolClass,
          subjects: subjects,
          total_no_of_student: total,
        },
      };
      return toReturnObj;
    });
    return dashBoard;
  }

  async stats() {
    const teacher = await this.prismaService.teacher.count(); // total of teacher
    const students = await this.prismaService.student.count(); // total of student

    const classSizes = await this.prismaService.schoolClass.findMany({
      include: {
        students: true,
      },
    });

    const totalClassSizes = classSizes.map((c) => c.students.length); // gives the length of students for a class in array
    const averageClassSize =
      totalClassSizes.reduce((sum, size) => sum + size, 0) / //using reduce to add the total
      totalClassSizes.length;

    const count = await this.prismaService.teachingAssignment.groupBy({
      by: ['subjectId'],
      _count: {
        subjectId: true,
      },
      orderBy: {
        _count: {
          subjectId: 'desc',
        },
      },
      take: 1,
    });
    const subject = await this.prismaService.subject.findFirst({
      where: { id: count[0].subjectId },
    });
    const repetition = count[0]._count.subjectId;

    return {
      totalNumberofTeachers: teacher,
      totalNumberofStudents: students,
      averageClassSize,
      favouriteClass: {
        subject,
        noOfClassesBeingTaughtIn: repetition,
      },
    };
  }
}
