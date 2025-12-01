import { ApiProperty } from '@nestjs/swagger';

export class ClassSubjectResponseDto {
  @ApiProperty({ description: 'ID of the class subject' })
  id: string;

  @ApiProperty({ description: 'ID of the subject' })
  subjectId: string;

  @ApiProperty({ description: 'ID of the teacher' })
  teacherId: string;

  @ApiProperty({ description: 'Name of the subject' })
  subjectName?: string;

  @ApiProperty({ description: 'Name of the teacher' })
  teacherName?: string;
}

export class ClassScheduleResponseDto {
  @ApiProperty({ description: 'ID of the schedule' })
  id: string;

  @ApiProperty({ description: 'Day of the week' })
  day: string;

  @ApiProperty({ description: 'List of periods' })
  periods: any[]; // You can create a more specific type if needed
}

export class ClassResponseDto {
  @ApiProperty({ description: 'ID of the class' })
  id: string;

  @ApiProperty({ description: 'Name of the class' })
  className: string;

  @ApiProperty({ description: 'Unique code for the class' })
  classCode: string;

  @ApiProperty({ description: 'Academic year' })
  academicYear: string;

  @ApiProperty({ description: 'Grade level' })
  gradeLevel: string;

  @ApiProperty({ description: 'Section' })
  section: string;

  @ApiProperty({ description: 'ID of the class teacher' })
  classTeacherId: string;

  @ApiProperty({ description: 'Name of the class teacher' })
  classTeacherName?: string;

  @ApiProperty({ description: 'List of co-teacher IDs' })
  coTeachers: string[];

  @ApiProperty({ description: 'List of co-teacher names' })
  coTeacherNames?: string[];

  @ApiProperty({ description: 'Class capacity' })
  capacity: number;

  @ApiProperty({ description: 'Current number of students' })
  currentStrength: number;

  @ApiProperty({ description: 'Class settings' })
  settings: any;

  @ApiProperty({ description: 'List of subjects', type: [ClassSubjectResponseDto] })
  subjects: ClassSubjectResponseDto[];

  @ApiProperty({ description: 'Class schedule', type: [ClassScheduleResponseDto] })
  schedule: ClassScheduleResponseDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
