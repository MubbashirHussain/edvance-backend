# Existing Modules Reference

## 📋 Overview

This document provides a quick reference for all existing modules in the Edvance Backend, their structure, patterns, and key implementation details.

## 🏗 Module Structure Pattern

Each module follows this consistent structure:

```
module-name/
├── dto/
│   ├── create-[resource].dto.ts
│   ├── update-[resource].dto.ts
│   ├── [resource]-response.dto.ts
│   └── [resource]-filter.dto.ts (optional)
├── [resource].controller.ts
├── [resource].service.ts
└── [resource].module.ts
```

## 📚 Existing Modules

### 1. Student Module

**Location**: `src/modules/school/student/`

**Key Features**:

- Student CRUD operations
- Parent-student relationship management
- Pagination and filtering
- Search by name, admission number, or student ID

**Controller Pattern**:

```typescript
@Controller('school/student')
@UseGuards(CustomJwtGuard)
```

**Service Highlights**:

- Uses transactions for creating students with parents
- Checks for existing parents by CNIC or email
- Supports finding by UUID or custom student ID
- Implements soft delete with parent relationship cleanup

**DTOs**:

- `CreateStudentDto` - Includes nested parent array
- `UpdateStudentDto` - Partial update support
- `StudentFilterDto` - Search, grade, section, gender, status filters
- Uses `PaginationParamsDto` from common

**Unique Patterns**:

```typescript
// Helper method to extract schoolId from JWT
private async getSchoolId(userId: string): Promise<string> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { schoolId: true },
  });

  if (!user || !user.schoolId) {
    throw new ForbiddenException('User is not associated with any school');
  }

  return user.schoolId;
}
```

**API Endpoints**:

- `POST /school/student/create`
- `GET /school/student`
- `GET /school/student/:id`
- `PATCH /school/student/:id`
- `DELETE /school/student/:id`

---

### 2. Subject Module

**Location**: `src/modules/school/subject/`

**Key Features**:

- Subject CRUD operations
- School-specific subjects
- Subject code uniqueness per school
- Active/inactive status management

**Controller Pattern**:

```typescript
@Controller('school/subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
```

**Service Highlights**:

- Validates unique subject code per school
- Filters subjects by school ID
- Checks for class assignments before deletion

**DTOs**:

- `CreateSubjectDto` - Name, code, description, schoolId
- `UpdateSubjectDto` - Partial update
- `SubjectResponseDto` - Full subject details

**Unique Patterns**:

```typescript
// Check for class assignments before deletion
async remove(id: string): Promise<void> {
  const subject = await this.findOne(id);

  const classSubjects = await this.prisma.classSubject.count({
    where: { subjectId: id },
  });

  if (classSubjects > 0) {
    throw new ConflictException(
      'Cannot delete subject as it is assigned to one or more classes'
    );
  }

  await this.prisma.subject.delete({ where: { id } });
}
```

**API Endpoints**:

- `POST /school/subjects`
- `GET /school/subjects?schoolId=xxx`
- `GET /school/subjects/:id`
- `PUT /school/subjects/:id`
- `DELETE /school/subjects/:id`

---

### 3. Class Module

**Location**: `src/modules/school/class/`

**Key Features**:

- Class CRUD operations
- Teacher assignments (main teacher + co-teachers)
- Capacity management
- Custom settings per class

**Controller Pattern**:

```typescript
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
```

**Service Highlights**:

- Validates unique class code per school
- Verifies school and teacher existence
- Manages class capacity and current strength
- Stores custom settings as JSON

**DTOs**:

- `CreateClassDto` - Comprehensive class creation
- `ClassResponseDto` - Includes teacher and subject relations

**Unique Patterns**:

```typescript
// Validate school and teacher
const school = await this.prisma.school.findUnique({
  where: { id: createDto.schoolId },
});

if (!school) {
  throw new NotFoundException('School not found');
}

const teacher = await this.prisma.user.findUnique({
  where: { id: createDto.classTeacherId },
});

if (!teacher) {
  throw new NotFoundException('Class teacher not found');
}
```

**API Endpoints**:

- `POST /classes`
- `GET /classes/:id`

---

### 4. SuperAdmin Auth Module

**Location**: `src/modules/superadmin/auth/`

**Key Features**:

- Super admin registration
- Super admin login
- Refresh token mechanism

**Controller Pattern**:

```typescript
@Controller('superadmin/auth')
```

**Service Highlights**:

- Password hashing with bcrypt
- JWT token generation
- Refresh token storage in database
- Email uniqueness validation

**DTOs**:

- `SignUpDto` - Email, password, firstName, lastName
- `SignInDto` - Email, password
- `RefreshTokenDto` - Refresh token

**Unique Patterns**:

```typescript
// Token generation
const payload = {
  userId: user.id,
  email: user.email,
  role: user.role,
};

const accessToken = this.tokenService.generateAccessToken(payload);
const refreshToken = this.tokenService.generateRefreshToken(payload);

// Store refresh token
await this.prisma.user.update({
  where: { id: user.id },
  data: { refreshToken },
});
```

**API Endpoints**:

- `POST /superadmin/auth/signup`
- `POST /superadmin/auth/signin`
- `POST /superadmin/auth/refresh`

---

### 5. School Management Module

**Location**: `src/modules/superadmin/school/`

**Key Features**:

- School CRUD operations (SuperAdmin only)
- School configuration management
- Module permissions per school
- Multi-tenant setup

**Controller Pattern**:

```typescript
@Controller('superadmin/school')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
```

**Service Highlights**:

- Validates unique school name and domain
- Manages school plans and billing
- Configures module permissions
- Tracks school status (ACTIVE, TRIAL, PAUSED, INACTIVE)

**DTOs**:

- `CreateSchoolDto` - Comprehensive school setup
- `UpdateSchoolDto` - Partial update
- `SchoolResponseDto` - Full school details

**API Endpoints**:

- `POST /superadmin/school/create`
- `GET /superadmin/school/all`
- `GET /superadmin/school/one/:id`
- `PATCH /superadmin/school/update/:id`
- `DELETE /superadmin/school/delete/:id`

---

### 6. School Auth Module

**Location**: `src/modules/school/auth/`

**Key Features**:

- School user login
- Refresh token mechanism
- School-specific authentication

**Controller Pattern**:

```typescript
@Controller('school/auth')
```

**Service Highlights**:

- Validates user belongs to a school
- Checks user status (ACTIVE, INACTIVE, etc.)
- Generates tokens with schoolId in payload

**DTOs**:

- `SignInDto` - Email, password
- `RefreshTokenDto` - Refresh token

**API Endpoints**:

- `POST /school/auth/signin`
- `POST /school/auth/refresh`

---

### 7. Teacher Module

**Location**: `src/modules/school/teacher/`

**Key Features**:

- Teacher CRUD operations
- Profile management (qualification, experience, specialization)
- Linked User account creation with default password
- Role-based access control

**Controller Pattern**:

```typescript
@Controller('school/teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
```

**Service Highlights**:

- Creates `User` (auth) and `Teacher` (profile) in a single transaction
- Hashes default password for new teachers
- Updates both User and Teacher details
- Prevents deletion if assigned to classes

**DTOs**:

- `CreateTeacherDto` - User details + Profile details
- `UpdateTeacherDto` - Partial update
- `TeacherResponseDto` - Combined User and Teacher info

**API Endpoints**:

- `POST /school/teachers`
- `GET /school/teachers`
- `GET /school/teachers/:id`
- `PATCH /school/teachers/:id`
- `DELETE /school/teachers/:id`

---

## 🔑 Common Patterns Across Modules

### 1. Guard Usage

**JWT Authentication Only**:

```typescript
@UseGuards(JwtAuthGuard)
```

**JWT + Role-Based Authorization**:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
```

**Custom JWT with School Context**:

```typescript
@UseGuards(CustomJwtGuard)
```

### 2. Error Handling

```typescript
// Not Found
throw new NotFoundException(`Resource with ID ${id} not found`);

// Conflict
throw new ConflictException('Resource already exists');

// Forbidden
throw new ForbiddenException('User is not associated with any school');

// Bad Request
throw new BadRequestException('Invalid input');
```

### 3. Prisma Queries

**Find with Relations**:

```typescript
await this.prisma.student.findFirst({
  where: { id, schoolId },
  include: {
    parents: {
      include: {
        parent: true,
      },
    },
  },
});
```

**Pagination**:

```typescript
const { page = 1, limit = 10 } = pagination;
const skip = (page - 1) * limit;

const [total, data] = await Promise.all([
  this.prisma.resource.count({ where }),
  this.prisma.resource.findMany({ where, skip, take: limit }),
]);
```

**Transactions**:

```typescript
return this.prisma.$transaction(async (tx) => {
  const resource = await tx.resource.create({ data });
  await tx.relatedResource.create({ data: { resourceId: resource.id } });
  return resource;
});
```

### 4. DTO Validation

```typescript
@ApiProperty({ description: 'Field description', example: 'Example' })
@IsString()
@IsNotEmpty()
field: string;

@ApiProperty({ required: false })
@IsOptional()
@IsEmail()
optionalField?: string;
```

### 5. Swagger Documentation

```typescript
@ApiOperation({ summary: 'Operation description' })
@ApiResponse({
  status: HttpStatus.CREATED,
  description: 'Success message',
  type: ResponseDto,
})
@ApiResponse({
  status: HttpStatus.CONFLICT,
  description: 'Error message',
})
```

## 📊 Module Comparison

| Module            | Guard Type                | Pagination | Transactions | Soft Delete |
| ----------------- | ------------------------- | ---------- | ------------ | ----------- |
| Student           | CustomJwtGuard            | ✅         | ✅           | ✅          |
| Subject           | JwtAuthGuard + RolesGuard | ❌         | ❌           | ❌          |
| Class             | JwtAuthGuard + RolesGuard | ❌         | ❌           | ❌          |
| SuperAdmin Auth   | None (public)             | ❌         | ❌           | ❌          |
| School Management | JwtAuthGuard + RolesGuard | ❌         | ❌           | ❌          |
| School Auth       | None (public)             | ❌         | ❌           | ❌          |

## 🎯 Best Practices Observed

1. **Consistent Naming**: All files follow kebab-case naming
2. **DTO Validation**: All DTOs use class-validator decorators
3. **Swagger Documentation**: All endpoints documented with @ApiOperation and @ApiResponse
4. **Error Handling**: Consistent use of NestJS exceptions
5. **Type Safety**: Full TypeScript typing throughout
6. **Prisma Integration**: Uses generated Prisma client from custom path
7. **Multi-tenancy**: School-based data isolation
8. **Audit Trails**: createdAt, updatedAt, createdBy, updatedBy fields

## 🚀 Next Module Recommendations

Based on the existing patterns, the **Teacher Module** should be implemented next with:

- Similar structure to Student module
- Use JwtAuthGuard + RolesGuard
- Include teacher-subject assignments
- Support teacher-class assignments
- Implement pagination and filtering
- Add qualification and experience tracking

See [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md) for step-by-step instructions.
