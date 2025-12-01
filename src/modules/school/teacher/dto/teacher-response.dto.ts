import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  qualification?: string;

  @ApiProperty({ required: false })
  experience?: string;

  @ApiProperty({ required: false })
  specialization?: string;

  @ApiProperty({ required: false })
  joiningDate?: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
