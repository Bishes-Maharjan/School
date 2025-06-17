import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ExceptionHandler } from './logger/exceptionHandler/exceptionHandlet';
import { LoggerModule } from './logger/logger.module';
import { SchoolModule } from './school/school.module';
import { StudentAndTeacherModule } from './studentAndTeacher/studentAndTeacher.module';

@Module({
  imports: [
    SchoolModule,
    StudentAndTeacherModule,
    LoggerModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
})
export class AppModule {}
