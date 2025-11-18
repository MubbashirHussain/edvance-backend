
import { Injectable, ConflictException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { Request } from 'express';
import { CustomJwtGuard } from '../../../common/guards/custom-jwt.guard';
import { UserRole } from '../../../common/enums/user-role.enum';
import { UserStatus } from '../../../common/enums/user-status.enum';

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
            password: randomPassword, // Temporary password, should be changed on first login
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
        const { password, ...adminResult } = newAdmin;
        return { school: newSchool, admin: adminResult };
      });

      return result;
    } catch (error) {
      // Handle potential errors during the transaction
      throw new InternalServerErrorException('Failed to create school and admin user.', error.message);
    }
  }
}
