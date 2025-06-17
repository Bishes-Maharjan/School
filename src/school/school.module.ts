import { Global, Module } from '@nestjs/common';
import { RolesGuard } from 'src/globals/role.guard';
import { PrismaService } from './prisma/prisma.service';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Global()
@Module({
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService, RolesGuard],
  exports: [SchoolService, PrismaService, RolesGuard],
})
export class SchoolModule {}
