import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectResponseDto } from './dto/subject-response.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    // Check if subject with same code already exists in the school
    const existingSubject = await this.prisma.subject.findFirst({
      where: {
        code: createSubjectDto.code,
        schoolId: createSubjectDto.schoolId,
      },
    });

    if (existingSubject) {
      throw new ConflictException(
        'Subject with this code already exists in this school',
      );
    }

    // Check if school exists
    const school = await this.prisma.school.findUnique({
      where: { id: createSubjectDto.schoolId },
    });

    if (!school) {
      throw new BadRequestException('School not found');
    }

    const subject = await this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
        code: createSubjectDto.code,
        description: createSubjectDto.description,
        school: { connect: { id: createSubjectDto.schoolId } },
      },
    });

    return this.mapToDto(subject);
  }

  async findAll(schoolId: string): Promise<SubjectResponseDto[]> {
    const subjects = await this.prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
    return subjects.map((subject) => this.mapToDto(subject));
  }

  async findOne(id: string): Promise<SubjectResponseDto> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return this.mapToDto(subject);
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    // Check if subject exists
    const currentSubject = await this.findOne(id);

    // If code is being updated, check for duplicates
    if (updateSubjectDto.code) {
      const existingSubject = await this.prisma.subject.findFirst({
        where: {
          code: updateSubjectDto.code,
          schoolId: currentSubject.schoolId,
          NOT: { id },
        },
      });

      if (existingSubject) {
        throw new ConflictException(
          'Another subject with this code already exists in this school',
        );
      }
    }

    const updatedSubject = await this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });

    return this.mapToDto(updatedSubject);
  }

  async remove(id: string): Promise<void> {
    // Check if subject exists
    await this.findOne(id);

    // Check if subject is assigned to any class
    const classSubject = await this.prisma.classSubject.findFirst({
      where: { subjectId: id },
    });

    if (classSubject) {
      throw new ConflictException(
        'Cannot delete subject as it is assigned to one or more classes',
      );
    }

    await this.prisma.subject.delete({
      where: { id },
    });
  }

  private mapToDto(subject: any): SubjectResponseDto {
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      description: subject.description || undefined,
      schoolId: subject.schoolId,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
    };
  }
}
