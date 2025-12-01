import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherFilterDto } from './dto/teacher-filter.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { Prisma } from '../../../../generated/prisma';
import { UserRole } from '../../../common/enums/user-role.enum';
import { UserStatus } from '../../../../generated/prisma';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTeacherDto) {
    // Check for existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Use provided password or default
    const password = createDto.password || 'Teacher@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: createDto.email,
          password: hashedPassword,
          firstName: createDto.firstName,
          lastName: createDto.lastName,
          phone: createDto.phone,
          role: UserRole.SCHOOL_TEACHER,
          status: UserStatus.ACTIVE,
          schoolId: createDto.schoolId,
          emailVerified: true, // Auto-verify for now
        },
      });

      // 2. Create Teacher Profile
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          schoolId: createDto.schoolId,
          qualification: createDto.qualification,
          experience: createDto.experience,
          specialization: createDto.specialization,
          joiningDate: createDto.joiningDate
            ? new Date(createDto.joiningDate)
            : undefined,
          status: 'ACTIVE',
        },
        include: {
          user: true,
        },
      });

      return this.mapToResponse(teacher);
    });
  }

  async findAll(schoolId: string, filter?: TeacherFilterDto) {
    const where: Prisma.TeacherWhereInput = {
      schoolId,
      ...(filter?.status && { status: filter.status }),
      ...(filter?.specialization && {
        specialization: {
          contains: filter.specialization,
          mode: 'insensitive',
        },
      }),
      ...(filter?.search && {
        user: {
          OR: [
            { firstName: { contains: filter.search, mode: 'insensitive' } },
            { lastName: { contains: filter.search, mode: 'insensitive' } },
            { email: { contains: filter.search, mode: 'insensitive' } },
          ],
        },
      }),
    };

    const teachers = await this.prisma.teacher.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return teachers.map((teacher) => this.mapToResponse(teacher));
  }

  async findOne(id: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id, schoolId },
      include: {
        user: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return this.mapToResponse(teacher);
  }

  async update(id: string, schoolId: string, updateDto: UpdateTeacherDto) {
    const teacher = await this.findOne(id, schoolId);

    return this.prisma.$transaction(async (tx) => {
      // Update User details if provided
      if (
        updateDto.firstName ||
        updateDto.lastName ||
        updateDto.email ||
        updateDto.phone
      ) {
        // Check email uniqueness if changing
        if (updateDto.email && updateDto.email !== teacher.email) {
          const existing = await tx.user.findUnique({
            where: { email: updateDto.email },
          });
          if (existing) {
            throw new ConflictException('Email already in use');
          }
        }

        await tx.user.update({
          where: { id: teacher.userId },
          data: {
            firstName: updateDto.firstName,
            lastName: updateDto.lastName,
            email: updateDto.email,
            phone: updateDto.phone,
          },
        });
      }

      // Update Teacher profile
      const updatedTeacher = await tx.teacher.update({
        where: { id },
        data: {
          qualification: updateDto.qualification,
          experience: updateDto.experience,
          specialization: updateDto.specialization,
          joiningDate: updateDto.joiningDate
            ? new Date(updateDto.joiningDate)
            : undefined,
        },
        include: {
          user: true,
        },
      });

      return this.mapToResponse(updatedTeacher);
    });
  }

  async remove(id: string, schoolId: string) {
    const teacher = await this.findOne(id, schoolId);

    // Soft delete or hard delete?
    // For now, let's delete the teacher profile and deactivate the user
    // or delete both if no other dependencies.
    // Given Class references User, deleting User might be risky if they are assigned to classes.
    // But TeacherService.remove implies removing the teacher.

    // Let's check if assigned to classes
    const classCount = await this.prisma.class.count({
      where: { classTeacherId: teacher.userId },
    });

    if (classCount > 0) {
      throw new ConflictException('Cannot delete teacher assigned to classes');
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete teacher profile
      await tx.teacher.delete({
        where: { id },
      });

      // Delete user or deactivate?
      // Let's delete user for now to keep it clean, assuming no other important data
      await tx.user.delete({
        where: { id: teacher.userId },
      });
    });
  }

  private mapToResponse(teacher: any): TeacherResponseDto {
    return {
      id: teacher.id,
      userId: teacher.userId,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email,
      phone: teacher.user.phone,
      qualification: teacher.qualification,
      experience: teacher.experience,
      specialization: teacher.specialization,
      joiningDate: teacher.joiningDate,
      status: teacher.status,
      schoolId: teacher.schoolId,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }
}
