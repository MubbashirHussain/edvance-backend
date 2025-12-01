import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateClassDto,
  ClassSubjectDto,
  ClassScheduleDto,
} from './dto/create-class.dto';
import { ClassResponseDto } from './dto/class-response.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(createClassDto: CreateClassDto): Promise<ClassResponseDto> {
    const {
      schoolId,
      className,
      classCode,
      academicYear,
      gradeLevel,
      section,
      classTeacherId,
      coTeachers = [],
      subjects = [],
      capacity = 40,
      schedule = [],
      settings = {},
    } = createClassDto;

    // Check if class with the same code already exists
    const existingClass = await this.prisma.class.findUnique({
      where: { classCode },
    });

    if (existingClass) {
      throw new ConflictException('Class with this code already exists');
    }

    // Check if school exists
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if class teacher exists (try Teacher profile first, then User)
    let teacherUserId = classTeacherId;

    // 1. Try to find by Teacher ID
    const teacherProfile = await this.prisma.teacher.findUnique({
      where: { id: classTeacherId },
      select: { userId: true, schoolId: true },
    });

    if (teacherProfile) {
      if (teacherProfile.schoolId !== schoolId) {
        throw new NotFoundException('Teacher belongs to a different school');
      }
      teacherUserId = teacherProfile.userId;
    }

    // Validate class teacher exists and is active in the Teacher table
    const classTeacher = await this.prisma.teacher.findFirst({
      where: { 
        id: classTeacherId, 
        schoolId,
        status: 'ACTIVE'
      },
      include: {
        user: true
      }
    });

    if (!classTeacher) {
      throw new NotFoundException(
        `Class teacher with ID ${classTeacherId} not found or is not active`,
      );
    }

    // Validate co-teachers if provided
    if (coTeachers.length > 0) {
      for (const coTeacherId of coTeachers) {
        // Skip if co-teacher is the same as class teacher
        if (coTeacherId === classTeacherId) {
          throw new ConflictException(
            'Class teacher cannot be added as a co-teacher',
          );
        }

        const coTeacher = await this.prisma.teacher.findFirst({
          where: { 
            id: coTeacherId, 
            schoolId,
            status: 'ACTIVE'
          },
          include: {
            user: true
          }
        });

        if (!coTeacher) {
          throw new NotFoundException(
            `Co-teacher with ID ${coTeacherId} not found or is not active`,
          );
        }
      }
    }

    // Create the class with transaction to ensure data consistency
    const newClass = await this.prisma.$transaction(async (prisma) => {
      // Create the class
      const createdClass = await prisma.class.create({
        data: {
          schoolId,
          className,
          classCode,
          academicYear,
          gradeLevel,
          section,
          classTeacherId: classTeacher.userId,
          coTeachers: coTeachers || [],
          capacity,
          currentStrength: 0, // Initialize with 0 students
          settings: settings as any, // Type assertion as Prisma.JsonValue
          isActive: true,
        },
      });

      // Add class subjects if provided
      if (subjects.length > 0) {
        // Validate all subject teachers first
        for (const subject of subjects) {
          const subjectTeacher = await prisma.teacher.findUnique({
            where: { id: subject.teacherId, schoolId },
          });

          if (!subjectTeacher) {
            throw new NotFoundException(
              `Subject teacher with ID ${subject.teacherId} not found`,
            );
          }

          if (subjectTeacher.status !== 'ACTIVE') {
            throw new ConflictException(
              `Teacher with ID ${subject.teacherId} is not active`,
            );
          }
        }

        await Promise.all(
          subjects.map((subject: ClassSubjectDto) =>
            prisma.classSubject.create({
              data: {
                classId: createdClass.id,
                subjectId: subject.subjectId,
                teacherId: subject.teacherId,
              },
            }),
          ),
        );
      }

      // Add class schedule if provided
      if (schedule.length > 0) {
        await Promise.all(
          schedule.map((daySchedule: ClassScheduleDto) =>
            prisma.classSchedule.create({
              data: {
                classId: createdClass.id,
                day: daySchedule.day,
                periods: daySchedule.periods as any, // Type assertion as Prisma.JsonValue
              },
            }),
          ),
        );
      }

      return {
        ...createdClass,
        classTeacher,
        coTeachers: coTeachers
      };
    });

    // Fetch the created class with relations for the response
    return this.getClassById(newClass.id);
  }

  async getClassById(classId: string): Promise<ClassResponseDto> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        classTeacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        subjects: {
          include: {
            subject: true,
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        schedule: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    // Map to response DTO
    return {
      id: classData.id,
      className: classData.className,
      classCode: classData.classCode,
      academicYear: classData.academicYear,
      gradeLevel: classData.gradeLevel,
      section: classData.section,
      classTeacherId: classData.classTeacherId,
      classTeacherName: `${classData.classTeacher.firstName} ${classData.classTeacher.lastName}`,
      coTeachers: classData.coTeachers,
      capacity: classData.capacity,
      currentStrength: classData.currentStrength,
      settings: classData.settings as any,
      subjects: classData.subjects.map((sub) => ({
        id: sub.id,
        subjectId: sub.subjectId,
        teacherId: sub.teacherId,
        subjectName: (sub as any).subject?.name,
        teacherName: (sub as any).teacher
          ? `${(sub as any).teacher.firstName} ${(sub as any).teacher.lastName}`
          : '',
      })),
      schedule: classData.schedule.map((sched) => ({
        id: sched.id,
        day: sched.day,
        periods: sched.periods as any[],
      })),
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt,
    };
  }
}
