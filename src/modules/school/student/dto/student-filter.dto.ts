import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StudentStatus, Gender } from '../../../../../generated/prisma';

export class StudentFilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string; // Search by name, admission no, student id

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    grade?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    section?: string;

    @ApiPropertyOptional({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ enum: StudentStatus })
    @IsOptional()
    @IsEnum(StudentStatus)
    status?: StudentStatus;
}
