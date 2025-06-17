import { Module } from '@nestjs/common';
import { StudentAndTeacherController } from './studentAndTeacher.controller';
import { StudentAndTeacherService } from './studentAndTeacher.service';

@Module({
  controllers: [StudentAndTeacherController],
  providers: [StudentAndTeacherService],
})
export class StudentAndTeacherModule {}
