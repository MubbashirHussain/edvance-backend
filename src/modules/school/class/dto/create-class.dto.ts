import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class ClassSubjectDto {
  @ApiProperty({ description: 'ID of the subject' })
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ description: 'ID of the teacher' })
  @IsString()
  @IsNotEmpty()
  teacherId: string;
}

export class ClassSchedulePeriodDto {
  @ApiProperty({ description: 'Start time of the period (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'End time of the period (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: 'ID of the subject' })
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ description: 'ID of the teacher' })
  @IsString()
  @IsNotEmpty()
  teacherId: string;
}

export class ClassScheduleDto {
  @ApiProperty({ description: 'Day of the week', example: 'Monday' })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty({ type: [ClassSchedulePeriodDto], description: 'List of periods for this day' })
  @IsArray()
  @IsNotEmpty()
  periods: ClassSchedulePeriodDto[];
}

export class ClassSettingsDto {
  @ApiProperty({ description: 'Whether attendance is required' })
  @IsBoolean()
  @IsOptional()
  attendanceRequired?: boolean;

  @ApiProperty({ description: 'Whether parent messaging is allowed' })
  @IsBoolean()
  @IsOptional()
  allowParentMessaging?: boolean;

  @ApiProperty({ description: 'Whether exams are included' })
  @IsBoolean()
  @IsOptional()
  examIncluded?: boolean;
}

export class CreateClassDto {
  @ApiProperty({ description: 'ID of the school' })
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty({ description: 'Name of the class', example: 'Grade 5' })
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ description: 'Unique code for the class', example: 'GRADE5A2024' })
  @IsString()
  @IsNotEmpty()
  classCode: string;

  @ApiProperty({ description: 'Academic year', example: '2024-2025' })
  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @ApiProperty({ description: 'Grade level', example: '5' })
  @IsString()
  @IsNotEmpty()
  gradeLevel: string;

  @ApiProperty({ description: 'Section', example: 'A' })
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty({ description: 'ID of the class teacher' })
  @IsString()
  @IsNotEmpty()
  classTeacherId: string;

  @ApiProperty({ 
    description: 'List of co-teachers', 
    type: [String],
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  coTeachers?: string[];

  @ApiProperty({ 
    description: 'List of subjects',
    type: [ClassSubjectDto],
    required: false 
  })
  @IsArray()
  @IsOptional()
  subjects?: ClassSubjectDto[];

  @ApiProperty({ 
    description: 'Class capacity',
    minimum: 1,
    default: 40 
  })
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiProperty({ 
    description: 'Class schedule',
    type: [ClassScheduleDto],
    required: false 
  })
  @IsArray()
  @IsOptional()
  schedule?: ClassScheduleDto[];

  @ApiProperty({ 
    description: 'Class settings',
    type: ClassSettingsDto,
    required: false 
  })
  @IsOptional()
  settings?: ClassSettingsDto;
}
