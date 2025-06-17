import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class TeacherAssignmentDto {
  @ApiProperty({
    type: String,
    example: 'bishes',
    required: true,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  teacherName: string;

  @ApiProperty({
    type: String,
    example: '98xxxxxxxx',
    required: true,
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  contactDetails: string;

  @ApiProperty({ type: String, example: 'Math', required: true, minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  subject: string;

  @ApiProperty({ type: Number, example: 1, required: true, minimum: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  classNumber: number;

  @ApiProperty({ type: String, example: 'A', required: true, minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  section: string;
}

export class CreateStudentDto {
  @ApiProperty({
    type: String,
    example: 'bishes',
    required: true,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @ApiProperty({
    type: String,
    example: '98xxxxxxxx',
    required: true,
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  contactDetails: string;

  @ApiPropertyOptional({
    type: Number,
    example: 2,
    required: false,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  classNumber: number;

  @ApiPropertyOptional({
    type: String,
    example: 'A',
    required: false,
    minLength: 1,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  section: string;
}

export class PutStudentDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  rollNumber: number;

  @ApiProperty({
    type: String,
    example: 'bishes',
    required: true,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: '98xxxxxxxx',
    required: true,
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  contactDetails: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  schoolClassId: number;
}

export class PatchStudentDto extends PartialType(
  OmitType(PutStudentDto, ['rollNumber']),
) {}
