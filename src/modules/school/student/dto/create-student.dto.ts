import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    ArrayMaxSize
} from 'class-validator';
import { Gender } from '../../../../../generated/prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    middleName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cnic?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    occupation?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    education?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    monthlyIncome?: number;

    @ApiPropertyOptional({ default: true })
    @IsBoolean()
    @IsOptional()
    isAlive?: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    relationship: string;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    isPrimary?: boolean;
}

export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    studentId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    admissionNo: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    rollNumber?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    middleName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: string;

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bloodGroup?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    photoUrl?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currentGrade: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    section: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    admissionDate: string;

    @ApiProperty({ type: [CreateParentDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @Type(() => CreateParentDto)
    parents: CreateParentDto[];
}
