import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class TeacherFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false, enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsString()
  status?: string;
}
