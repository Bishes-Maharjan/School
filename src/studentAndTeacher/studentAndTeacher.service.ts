/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { StudentFilterDto, TeacherFilterDto } from 'src/school/dtos/filter.dto';
import {
  CreateStudentDto,
  PatchStudentDto,
  PutStudentDto,
} from 'src/school/dtos/global.dto';
import { PrismaService } from 'src/school/prisma/prisma.service';
import { SchoolService } from 'src/school/school.service';

@Injectable()
export class StudentAndTeacherService {
  constructor(
    private prismaService: PrismaService,
    private schoolService: SchoolService,
  ) {}
  //TEACHER Get LOGIC
  //Get all teacher
  async getAllTeacher(filters: TeacherFilterDto) {
    const {
      limit = 10,
      page = 1,
      classNumber,
      section,
      subject,
      name,
    } = filters;
    const assignmentFilters: any = {};

    if (classNumber) {
      assignmentFilters.schoolClass = {
        classNumber: Number(classNumber),
      };
    }

    if (section) {
      assignmentFilters.schoolClass = {
        ...assignmentFilters.schoolClass,
        section: {
          equals: section,
          mode: 'insensitive',
        },
      };
    }

    if (subject) {
      assignmentFilters.subject = {
        name: {
          equals: subject,
          mode: 'insensitive',
        },
      };
    }

    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (Object.keys(assignmentFilters).length > 0) {
      where.assignments = {
        some: assignmentFilters,
      };
    }
    const teachers = await this.prismaService.teacher.findMany({
      where,
      include: {
        assignments: {
          include: {
            schoolClass: true,
            subject: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const toReturnTeacher = teachers.map((teacher) => {
      //Make it look pretty
      const subjectAndClasses = teacher.assignments.map((assignment) => {
        const subject = assignment.subject.name;
        const className =
          assignment.schoolClass.classNumber.toString() +
          assignment.schoolClass.section;

        return { subject, className };
      });

      return {
        name: teacher.name,
        contactDetails: teacher.contactDetails,
        subjectAndClasses,
      };
    });

    return toReturnTeacher;
  }
  //get one teacher by id
  async getTeacherById(id: number) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: {
        id,
      },
      include: {
        assignments: {
          include: {
            schoolClass: true,
            subject: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const subjectAndClass = teacher.assignments.map((assignment) => {
      const subject = assignment.subject.name;
      const className =
        assignment.schoolClass.classNumber.toString() +
        assignment.schoolClass.section;
      return { subject, className };
    });

    return {
      name: teacher.name,
      contactDetails: teacher.contactDetails,
      subjectAndClass,
    };
  }

  //Student Get Logic
  //get all students
  async getAllStudent(filter: StudentFilterDto) {
    const {
      limit = 10,
      page = 1,
      classNumber,
      section,
      subject,
      name,
      teacherName,
    } = filter;

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const schoolClassFilter: any = {};

    if (classNumber) {
      schoolClassFilter.classNumber = Number(classNumber);
    }

    if (section) {
      schoolClassFilter.section = {
        equals: section.toUpperCase(),
        mode: 'insensitive',
      };
    }

    // filters for inside the assignmnets
    const assignmentFilter: any = {
      ...(subject && {
        subject: {
          name: {
            equals: subject.toLowerCase(),
            mode: 'insensitive',
          },
        },
      }),
      ...(teacherName && {
        teacher: {
          name: {
            contains: teacherName,
            mode: 'insensitive',
          },
        },
      }),
    };

    if (Object.keys(assignmentFilter).length > 0) {
      //can get to assignments through schoolClass
      schoolClassFilter.assignments = {
        some: assignmentFilter,
      };
    }

    if (Object.keys(schoolClassFilter).length > 0) {
      //placing assignment filter by going through the studdent class
      where.schoolClass = schoolClassFilter;
    }

    const students = await this.prismaService.student.findMany({
      where, // so in the end where is pretty much. {
      // name: name,
      // schoolClass : {
      //   section,
      //   classNumber,
      //   assignment: {
      //     some: {
      //       subject: {//the spread operator logic},
      //       teacher: {//the sem as above}
      //     }
      //   }
      // }
      // }
      skip: (page - 1) * limit,
      take: limit,
      include: {
        schoolClass: {
          include: {
            assignments: {
              include: {
                subject: true,
                teacher: true,
              },
            },
          },
        },
      },
    });

    //to give a prettier output
    const toReturnStudent = students.map((student) => {
      const schoolclass =
        student.schoolClass.classNumber.toString() +
        student.schoolClass.section;

      const assignment = student.schoolClass.assignments.map((assignment) => {
        const subjects = assignment.subject.name;
        const teachers = assignment.teacher.name;
        return { subjects, teachers };
      });

      return {
        rollNumber: student.rollNumber,
        name: student.name,
        contactDetails: student.contactDetails,
        class: schoolclass,
        subjectAndTeacher: assignment,
      };
    });

    return toReturnStudent;
  }
  //get one student by id
  async getStudentById(id: number) {
    const student = await this.prismaService.student.findUnique({
      where: {
        rollNumber: id,
      },
      include: {
        schoolClass: {
          include: {
            assignments: {
              include: {
                teacher: true,
                subject: true,
              },
            },
          },
        },
      },
    });
    if (!student) throw new NotFoundException('Student Doesnt exist');

    const subjectAndTeacher = student.schoolClass.assignments.map(
      (assignment) => {
        const subjects = assignment.subject.name;
        const teachers = assignment.teacher.name;
        return { subjects, teachers };
      },
    );

    return {
      rollNumber: student.rollNumber,
      name: student.name,
      contactDetails: student.contactDetails,
      class:
        student.schoolClass.classNumber.toString() +
        student.schoolClass.section,
      subjectAndTeacher,
    };
  }

  //STudent post, patch, put logic
  //post student
  async createStudent(createStudentDto: CreateStudentDto) {
    const { name, contactDetails, classNumber, section } = createStudentDto;
    const studentExist = await this.prismaService.student.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        contactDetails,
      },
    });
    if (studentExist) throw new BadRequestException('Student Already Exists');

    let schoolClassId: number | undefined;

    // Only find/create class if both classNumber and section are not blank ,cuz they are optional
    if (
      classNumber !== undefined &&
      section !== undefined &&
      section.trim() !== ''
    ) {
      let classExist = await this.prismaService.schoolClass.findFirst({
        where: {
          classNumber,
          section,
        },
      });

      if (!classExist) {
        classExist = await this.schoolService.createClass(classNumber, section);
      }

      schoolClassId = classExist.id;
    }

    const studentData: any = {
      name: name.toUpperCase(),
      contactDetails,
    };

    if (schoolClassId !== undefined) {
      studentData.schoolClassId = schoolClassId;
    }

    const student = await this.prismaService.student.create({
      data: studentData,
    });
    if (!student)
      throw new InternalServerErrorException(
        'Something went wrong creating student',
      );
    return student;
  }

  async putStudent(putStudentDtos: PutStudentDto) {
    const { rollNumber, schoolClassId, name, contactDetails } = putStudentDtos;
    const studentExist = await this.prismaService.student.findFirst({
      where: { contactDetails },
    });
    if (studentExist)
      throw new BadRequestException(
        'Student with those contact details already exist',
      );

    const classExist = await this.prismaService.schoolClass.findUnique({
      where: { id: schoolClassId },
    });
    if (!classExist)
      throw new NotFoundException('Class with that id doesnt exist');
    const updatedStudent = await this.prismaService.student.update({
      where: {
        rollNumber,
      },
      data: {
        schoolClassId,
        name,
        contactDetails,
      },
    });
    if (!updatedStudent)
      throw new BadRequestException('Couldnt  update the student');
    return { message: 'Updated the student through put', updatedStudent };
  }

  async patchStudent(rollNumber: number, patchStudentDto: PatchStudentDto) {
    const { name, contactDetails, schoolClassId } = patchStudentDto;
    const studentExist = await this.prismaService.student.findFirst({
      where: { contactDetails },
    });
    if (studentExist)
      throw new BadRequestException(
        'Student with those contact details already exist',
      );

    const classExist = await this.prismaService.schoolClass.findUnique({
      where: { id: schoolClassId },
    });
    if (!classExist)
      throw new NotFoundException('Class with that id doesnt exist');
    const updatedStudent = await this.prismaService.student.update({
      where: {
        rollNumber,
      },
      data: {
        schoolClassId,
        name,
        contactDetails,
      },
    });
    if (!updatedStudent)
      throw new BadRequestException('Couldnt partially update the student');
    return { message: 'Updated the student through patch', updatedStudent };
  }

  async deleteStudent(rollNumber: number) {
    const deletedUser = await this.prismaService.student.delete({
      where: {
        rollNumber,
      },
    });
    if (!deletedUser) throw new BadRequestException('Couldnt Delete User');
    return { message: 'Deleted User Successfully', deletedUser };
  }
}
