import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty({ description: 'Unique identifier of the subject' })
  id: string;

  @ApiProperty({ description: 'Name of the subject' })
  name: string;

  @ApiProperty({ description: 'Subject code' })
  code: string;

  @ApiProperty({ description: 'Description of the subject', required: false })
  description?: string;

  @ApiProperty({ description: 'ID of the school this subject belongs to' })
  schoolId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
