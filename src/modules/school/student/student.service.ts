import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFilterDto } from './dto/student-filter.dto';
import { PaginationParamsDto } from '../../../common/dto/pagination-params.dto';
import { Prisma } from '../../../../generated/prisma';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(schoolId: string, createStudentDto: CreateStudentDto) {
    const { parents, ...studentData } = createStudentDto;

    // Build OR conditions for checking existing student
    const orConditions: any[] = [
      { admissionNo: studentData.admissionNo },
      { studentId: studentData.studentId },
    ];
    if (studentData.email) {
      orConditions.push({ email: studentData.email });
    }

    // Check if student already exists
    const existingStudent = await this.prisma.student.findFirst({
      where: {
        schoolId,
        OR: orConditions,
      },
    });

    if (existingStudent) {
      throw new ConflictException(
        'Student with this Admission No, ID, or Email already exists',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Student
      const student = await tx.student.create({
        data: {
          ...studentData,
          schoolId,
          admissionDate: new Date(studentData.admissionDate),
          dateOfBirth: new Date(studentData.dateOfBirth),
        },
      });

      // 2. Process Parents
      if (parents && parents.length > 0) {
        for (const parentDto of parents) {
          const { relationship, isPrimary, ...parentInfo } = parentDto;

          // Check if parent exists globally by CNIC or Email
          // We check both to be sure, as these are unique fields
          const parentOrConditions: any[] = [];
          if (parentInfo.cnic)
            parentOrConditions.push({ cnic: parentInfo.cnic });
          if (parentInfo.email)
            parentOrConditions.push({ email: parentInfo.email });

          let parent: any = null;
          if (parentOrConditions.length > 0) {
            parent = await tx.parent.findFirst({
              where: {
                OR: parentOrConditions,
              },
            });
          }

          if (!parent) {
            // Create new parent
            parent = await tx.parent.create({
              data: {
                ...parentInfo,
                schoolId,
              },
            });
          }

          // 3. Link Student and Parent
          // Check if link already exists (in case of re-running or weird state)
          const existingLink = await tx.studentParent.findUnique({
            where: {
              studentId_parentId: {
                studentId: student.id,
                parentId: parent.id,
              },
            },
          });

          if (!existingLink) {
            await tx.studentParent.create({
              data: {
                studentId: student.id,
                parentId: parent.id,
                relationship,
                isPrimary,
              },
            });
          }
        }
      }

      return student;
    });
  }
  async findAll(
    schoolId: string,
    pagination: PaginationParamsDto,
    filter: StudentFilterDto,
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
      schoolId,
      ...(filter.search && {
        OR: [
          { firstName: { contains: filter.search, mode: 'insensitive' } },
          { lastName: { contains: filter.search, mode: 'insensitive' } },
          { admissionNo: { contains: filter.search, mode: 'insensitive' } },
          { studentId: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
      ...(filter.grade && { currentGrade: filter.grade }),
      ...(filter.section && { section: filter.section }),
      ...(filter.gender && { gender: filter.gender }),
      ...(filter.status && { status: filter.status }),
    };

    const [total, data] = await Promise.all([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          parents: {
            include: {
              parent: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return data;
  }

  async findOne(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId },
      include: {
        parents: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async findByStudentId(schoolId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { studentId, schoolId },
      include: {
        parents: {
          include: {
            parent: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  }

  async update(
    schoolId: string,
    id: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    const { parents, ...data } = updateStudentDto;

    // Verify existence
    await this.findOne(schoolId, id);

    return this.prisma.student.update({
      where: { id },
      data: {
        ...data,
        ...(data.admissionDate && {
          admissionDate: new Date(data.admissionDate),
        }),
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      },
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);

    // We might want to soft delete, but for now standard delete
    // Note: This might fail if there are other relations not set to cascade
    // For StudentParent, we should probably delete the link first

    return this.prisma.$transaction(async (tx) => {
      // Delete student-parent links first
      await tx.studentParent.deleteMany({
        where: { studentId: id },
      });

      return tx.student.delete({
        where: { id },
      });
    });
  }
}
