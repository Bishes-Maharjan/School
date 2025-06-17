import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TeacherFilterDto {
  @ApiProperty({ type: Number, example: 1, description: 'Page starts from 1' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ type: Number, example: 10, description: 'limit is 10' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    type: String,
    example: 'Bishes',
    required: false,
    description: 'Name of the person',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Class Number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  classNumber?: number;

  @ApiProperty({
    type: String,
    example: 'A',
    description: 'Section',
    required: false,
  })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiProperty({
    type: String,
    example: 'Math',
    description: 'Subject Name They are affiliated with',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;
}

export class StudentFilterDto extends TeacherFilterDto {
  @ApiProperty({
    type: String,
    example: 'Bishes',
    description: 'Teachers Name that teach classes they student is part of',
    required: false,
  })
  @IsOptional()
  @IsString()
  teacherName?: string;
}
