
import { Injectable, ConflictException, InternalServerErrorException, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Request } from 'express';
import { CustomJwtGuard } from '../../../common/guards/custom-jwt.guard';
import { UserRole } from '../../../common/enums/user-role.enum';
import { UserStatus } from '../../../common/enums/user-status.enum';
import { PaginationParamsDto } from '../../../common/dto/pagination-params.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SchoolService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => CustomJwtGuard))
    private readonly customJwtGuard: CustomJwtGuard
  ) {}

  async createSchool(
    createSchoolDto: CreateSchoolDto, 
    req: Request & { user: { userId: string } }
  ) {
    const { ...schoolData } = createSchoolDto;
    
    // Get the authenticated admin from the request
    const authUser = req.user;
    
    if (!authUser) {
      throw new InternalServerErrorException('No authenticated user found');
    }

    // Check if a school with the same name or domain already exists
    const existingSchool = await this.prisma.school.findFirst({
      where: {
        OR: [
          { name: schoolData.name },
          { domain: schoolData.domain },
        ],
      },
    });

    if (existingSchool) {
      throw new ConflictException('A school with this name or domain already exists.');
    }

    // Generate a random password for the new admin
    const randomPassword = Math.random().toString(36).slice(-10);
    const hashPassword = await bcrypt.hash(randomPassword, 10);
    const adminEmail = `admin@${schoolData.domain}.com`;

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the school
        const newSchool = await prisma.school.create({
          data: {
            ...schoolData,
          },
        });

        // Create the school admin user with a temporary password
        const newAdmin = await prisma.user.create({
          data: {
            email: adminEmail,
            password: hashPassword, // Temporary password, should be changed on first login
            role: UserRole.SCHOOL_ADMIN,
            status: UserStatus.ACTIVE as any, // Using 'as any' to match Prisma's expected type
            schoolId: newSchool.id,
            firstName: createSchoolDto.contactName || 'School',
            lastName: 'Admin',
            emailVerified: true,
            emailVerifiedAt: new Date(),
            createdById: authUser.userId, // Track who created this admin
          },
        });

        // Return both the school and the admin user, but without the password
        const { password : randomPassword, ...adminResult } = newAdmin;
        return { school: newSchool, admin: adminResult };
      });

      return result;
    } catch (error) {
      // Handle potential errors during the transaction
      throw new InternalServerErrorException('Failed to create school and admin user.', error.message);
    }
  }

  async findAll(pagination: PaginationParamsDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.school.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.school.count(),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    // Check if school exists
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    // Check if the new domain is already taken by another school
    if (updateSchoolDto.domain && updateSchoolDto.domain !== school.domain) {
      const existingSchool = await this.prisma.school.findFirst({
        where: {
          domain: updateSchoolDto.domain,
          id: { not: id },
        },
      });

      if (existingSchool) {
        throw new ConflictException('A school with this domain already exists.');
      }
    }

    return this.prisma.school.update({
      where: { id },
      data: updateSchoolDto,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if school exists
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    // Use a transaction to delete related records if needed
    // return this.prisma.$transaction(async (prisma) => {
    //   // Delete related users first if needed
    //   await prisma.user.deleteMany({
    //     where: { schoolId: id },
    //   });

    //   // Then delete the school
    //   return prisma.school.delete({
    //     where: { id },
    //   });
    // });
  }
}
