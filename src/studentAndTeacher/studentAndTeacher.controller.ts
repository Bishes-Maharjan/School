import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { Roles, ROLES_ENUM } from 'src/globals/role.decorator';
import { RolesGuard } from 'src/globals/role.guard';
import { StudentFilterDto, TeacherFilterDto } from 'src/school/dtos/filter.dto';
import {
  CreateStudentDto,
  PatchStudentDto,
  PutStudentDto,
} from 'src/school/dtos/global.dto';
import { StudentAndTeacherService } from './studentAndTeacher.service';

@Controller()
export class StudentAndTeacherController {
  constructor(private studentAndTeacherService: StudentAndTeacherService) {}
  //Teacher api endpoints

  @ApiOperation({ summary: 'Get All teacher with pagination and filter' })
  @Get('teacher')
  getAllTeacher(@Query() filters: TeacherFilterDto) {
    return this.studentAndTeacherService.getAllTeacher(filters);
  }

  @ApiOperation({ summary: 'Get teacher by id' })
  @Get('teacher/:id')
  getTeacherById(@Param('id') id: number) {
    return this.studentAndTeacherService.getTeacherById(id);
  }

  //STUDENT ENDPOINTS
  @ApiOperation({ summary: 'Get All students with pagination and filter' })
  @Get('student')
  getAllStudents(@Query() filters: StudentFilterDto) {
    return this.studentAndTeacherService.getAllStudent(filters);
  }

  @ApiOperation({ summary: 'Get student by rollNumber' })
  @Get('student/:id')
  getStudentById(@Param('id') rollNumber: number) {
    return this.studentAndTeacherService.getStudentById(rollNumber);
  }

  @ApiOperation({
    summary:
      'Create a student, this will create a class too if the class doesnt exist. The class details are optional. You dont have to input them. can later patch them',
  })
  @ApiHeader({
    name: 'x-role',
    required: true,
    description: 'Dummy role',
  })
  @UseGuards(RolesGuard)
  @Roles(ROLES_ENUM.TEACHER)
  @Post()
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentAndTeacherService.createStudent(createStudentDto);
  }

  @ApiOperation({ summary: 'Update student(put) with rollNumber in dto' })
  @ApiHeader({
    name: 'x-role',
    required: true,
    description: 'Dummy role',
  })
  @UseGuards(RolesGuard)
  @Roles(ROLES_ENUM.TEACHER)
  @Put()
  putStudent(@Body() putStudentDto: PutStudentDto) {
    return this.studentAndTeacherService.putStudent(putStudentDto);
  }

  @ApiOperation({ summary: 'Update student(patch) wuth rollnumber in param' })
  @ApiHeader({
    name: 'x-role',
    required: true,
    description: 'Dummy role',
  })
  @UseGuards(RolesGuard)
  @Roles(ROLES_ENUM.TEACHER)
  @Patch('student/:id')
  patchStudent(
    @Param('id') rollNumber: number,
    @Body() patchDto: PatchStudentDto,
  ) {
    return this.studentAndTeacherService.patchStudent(rollNumber, patchDto);
  }

  @ApiOperation({ summary: 'Delete student with rollNumber in param' })
  @ApiHeader({
    name: 'x-role',
    required: true,
    description: 'Dummy role',
  })
  @UseGuards(RolesGuard)
  @Roles(ROLES_ENUM.TEACHER)
  @Delete('student/:id')
  deleteStudent(@Param('id') rollNumber: number) {
    return this.studentAndTeacherService.deleteStudent(rollNumber);
  }
}
