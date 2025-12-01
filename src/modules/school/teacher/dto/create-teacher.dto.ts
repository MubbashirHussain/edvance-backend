import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'First name of the teacher',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the teacher',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@school.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    required: false,
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Qualification of the teacher',
    required: false,
    example: 'Masters in Mathematics',
  })
  @IsString()
  @IsOptional()
  qualification?: string;

  @ApiProperty({
    description: 'Years of experience',
    required: false,
    example: '5 years',
  })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiProperty({
    description: 'Specialization',
    required: false,
    example: 'Algebra, Geometry',
  })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty({
    description: 'Joining date',
    required: false,
    example: '2025-01-15',
  })
  @IsString()
  @IsOptional()
  joiningDate?: string;

  @ApiProperty({
    description: 'Password for the teacher account',
    example: 'SecurePass123!',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'School ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  schoolId: string;
}
