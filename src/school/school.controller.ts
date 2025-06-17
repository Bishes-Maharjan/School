import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { Roles, ROLES_ENUM } from 'src/globals/role.decorator';
import { RolesGuard } from 'src/globals/role.guard';
import { TeacherAssignmentDto } from './dtos/global.dto';
import { SchoolService } from './school.service';

@Controller()
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  //dashboard
  @Get('dashboard')
  @ApiOperation({
    summary:
      'dashboard that gives u the class and section as Id , with subjects object with subject and teacher who teaches it with total no. of students',
  })
  dashboard() {
    return this.schoolService.dashboard();
  }

  //assign a teacher to a class and subject. if none exist it will create all of them
  @Post('assignment')
  @ApiHeader({
    name: 'x-role',
    description: 'Bearer token for authentication',
    example: 'teacher',
    required: true,
  })
  @UseGuards(RolesGuard)
  @Roles(ROLES_ENUM.TEACHER)
  @ApiOperation({
    summary:
      'assign a teacher to a class and subject. if none exist it will create all of them. Test it for yourself to make new assignments and teacher and subject and classes',
  })
  createTeacherAssingment(@Body() teacherAssignmentDto: TeacherAssignmentDto) {
    return this.schoolService.createTeacherAssignment(teacherAssignmentDto);
  }

  @Get('stats')
  getStats() {
    return this.schoolService.stats();
  }
}
