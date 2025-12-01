# Module Development Guide

## 📋 Creating a New Module

This guide provides a step-by-step process for creating new modules in the Edvance Backend, following established patterns and conventions.

## 🎯 Before You Start

### Prerequisites Checklist

- [ ] Database schema updated in `prisma/schema.prisma`
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Module purpose and endpoints defined
- [ ] Required roles identified

## 📝 Step-by-Step Module Creation

### Step 1: Create Module Directory Structure

```bash
# For school-related modules
mkdir -p src/modules/school/[module-name]/{dto}

# Example: Teacher module
mkdir -p src/modules/school/teacher/{dto}
```

### Step 2: Create DTOs

#### 2.1 Create DTO (`create-[resource].dto.ts`)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'First name of the teacher',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the teacher',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@school.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    required: false,
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'School ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  schoolId: string;
}
```

#### 2.2 Update DTO (`update-[resource].dto.ts`)

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}
```

#### 2.3 Response DTO (`[resource]-response.dto.ts`)

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

#### 2.4 Filter DTO (Optional - `[resource]-filter.dto.ts`)

```typescript
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
  department?: string;

  @ApiProperty({ required: false, enum: ['ACTIVE', 'INACTIVE'] })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: string;
}
```

### Step 3: Create Service (`[resource].service.ts`)

```typescript
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherFilterDto } from './dto/teacher-filter.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { Prisma } from '../../../../generated/prisma';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTeacherDto): Promise<TeacherResponseDto> {
    // Check for existing teacher
    const existing = await this.prisma.teacher.findFirst({
      where: {
        email: createDto.email,
        schoolId: createDto.schoolId,
      },
    });

    if (existing) {
      throw new ConflictException('Teacher with this email already exists');
    }

    // Create teacher
    return this.prisma.teacher.create({
      data: createDto,
    });
  }

  async findAll(
    schoolId: string,
    filter?: TeacherFilterDto,
  ): Promise<TeacherResponseDto[]> {
    const where: Prisma.TeacherWhereInput = {
      schoolId,
      ...(filter?.search && {
        OR: [
          { firstName: { contains: filter.search, mode: 'insensitive' } },
          { lastName: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
      ...(filter?.department && { department: filter.department }),
      ...(filter?.status && { status: filter.status }),
    };

    return this.prisma.teacher.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, schoolId: string): Promise<TeacherResponseDto> {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id, schoolId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(
    id: string,
    schoolId: string,
    updateDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    // Verify existence
    await this.findOne(id, schoolId);

    // Check for email conflict if email is being updated
    if (updateDto.email) {
      const existing = await this.prisma.teacher.findFirst({
        where: {
          email: updateDto.email,
          schoolId,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.prisma.teacher.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string, schoolId: string): Promise<void> {
    await this.findOne(id, schoolId);

    await this.prisma.teacher.delete({
      where: { id },
    });
  }
}
```

### Step 4: Create Controller (`[resource].controller.ts`)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherFilterDto } from './dto/teacher-filter.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('School Teachers')
@ApiBearerAuth()
@Controller('school/teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Teacher created successfully',
    type: TeacherResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Teacher with this email already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  create(@Body() createDto: CreateTeacherDto): Promise<TeacherResponseDto> {
    return this.teacherService.create(createDto);
  }

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.SCHOOL_TEACHER)
  @ApiOperation({ summary: 'Get all teachers for a school' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of teachers',
    type: [TeacherResponseDto],
  })
  findAll(
    @Query('schoolId') schoolId: string,
    @Query() filter: TeacherFilterDto,
  ): Promise<TeacherResponseDto[]> {
    return this.teacherService.findAll(schoolId, filter);
  }

  @Get(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF, UserRole.SCHOOL_TEACHER)
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher found',
    type: TeacherResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolId') schoolId: string,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.findOne(id, schoolId);
  }

  @Patch(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher updated successfully',
    type: TeacherResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolId') schoolId: string,
    @Body() updateDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.update(id, schoolId, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Teacher deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolId') schoolId: string,
  ): Promise<void> {
    await this.teacherService.remove(id, schoolId);
  }
}
```

### Step 5: Create Module (`[resource].module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaModule } from '../../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
```

### Step 6: Register Module in Parent Module

Update `src/modules/school/school.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { SubjectModule } from './subject/subject.module';
import { ClassModule } from './class/class.module';
import { TeacherModule } from './teacher/teacher.module'; // Add this
import { SchoolAuthModule } from './auth/auth.module';

@Module({
  imports: [
    StudentModule,
    SubjectModule,
    ClassModule,
    TeacherModule, // Add this
    SchoolAuthModule,
  ],
})
export class SchoolModule {}
```

## 🎨 Code Style Checklist

- [ ] All DTOs have proper validation decorators
- [ ] All DTOs have Swagger `@ApiProperty` decorators
- [ ] Service methods handle errors properly (ConflictException, NotFoundException)
- [ ] Controller has proper HTTP status codes
- [ ] Controller has Swagger documentation
- [ ] Guards are applied correctly
- [ ] Roles are defined for each endpoint
- [ ] Prisma imports use generated client path
- [ ] Naming follows conventions (PascalCase for classes, camelCase for methods)

## 🔍 Testing Your Module

### 1. Start the development server

```bash
npm run start:dev
```

### 2. Check Swagger documentation

Navigate to: `http://localhost:3000/api/v1/docs` (if Swagger is configured)

### 3. Test endpoints with cURL or Postman

```bash
# Create
curl -X POST http://localhost:3000/api/v1/school/teachers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@school.com","schoolId":"uuid"}'

# Get All
curl -X GET "http://localhost:3000/api/v1/school/teachers?schoolId=uuid" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get One
curl -X GET http://localhost:3000/api/v1/school/teachers/uuid?schoolId=uuid \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update
curl -X PATCH http://localhost:3000/api/v1/school/teachers/uuid?schoolId=uuid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'

# Delete
curl -X DELETE http://localhost:3000/api/v1/school/teachers/uuid?schoolId=uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Common Patterns

### Pattern 1: Pagination

Add to service:

```typescript
import { PaginationParamsDto } from '../../../common/dto/pagination-params.dto';

async findAll(
  schoolId: string,
  pagination: PaginationParamsDto,
  filter?: FilterDto,
) {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    this.prisma.resource.count({ where }),
    this.prisma.resource.findMany({ where, skip, take: limit }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### Pattern 2: Transactions

```typescript
async createWithRelations(dto: CreateDto) {
  return this.prisma.$transaction(async (tx) => {
    const resource = await tx.resource.create({ data: dto });

    // Create related records
    await tx.relatedResource.create({
      data: { resourceId: resource.id, /* ... */ }
    });

    return resource;
  });
}
```

### Pattern 3: Soft Delete

```typescript
async remove(id: string, schoolId: string): Promise<void> {
  await this.findOne(id, schoolId);

  await this.prisma.resource.update({
    where: { id },
    data: { isActive: false, deletedAt: new Date() },
  });
}
```

## 🚨 Common Pitfalls

1. **Forgetting to import PrismaModule** in the module
2. **Not using generated Prisma client path** (`../../../../generated/prisma`)
3. **Missing validation decorators** on DTOs
4. **Not checking for existing records** before creation
5. **Forgetting to verify schoolId** in multi-tenant operations
6. **Not exporting service** if it's needed by other modules
7. **Missing Swagger documentation**
8. **Incorrect guard order** (JwtAuthGuard must come before RolesGuard)

## 📖 Next Steps

After creating your module:

1. Update API documentation in `docs/api-examples/`
2. Add module-specific documentation in `docs/modules/`
3. Update this guide if you discover new patterns
4. Consider writing unit tests
