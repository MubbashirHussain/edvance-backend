
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import * as bcrypt from 'bcrypt';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class SchoolService {
  constructor(private readonly prisma: PrismaService) {}

  async createSchool(createSchoolDto: CreateSchoolDto) {
    const { adminEmail, adminPassword, ...schoolData } = createSchoolDto;

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

    // Check if a user with the admin email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the school
        const newSchool = await prisma.school.create({
          data: {
            ...schoolData,
          },
        });

        // Create the school admin user
        const newAdmin = await prisma.user.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            role: Role.SCHOOL_ADMIN,
            status: UserStatus.ACTIVE,
            schoolId: newSchool.id,
            firstName: createSchoolDto.contactName || 'School',
            lastName: 'Admin',
            emailVerified: true,
            emailVerifiedAt: new Date(),
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
