# Edvance Backend - Codebase Overview

## 📋 Table of Contents

- [Project Information](#project-information)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Module Organization](#module-organization)
- [Code Style Guidelines](#code-style-guidelines)

## 🎯 Project Information

**Project Name**: Edvance Backend  
**Description**: A comprehensive school management system backend API  
**Framework**: NestJS v10.x  
**Database**: PostgreSQL with Prisma ORM  
**Authentication**: JWT-based authentication

## 🛠 Technology Stack

### Core Technologies

- **Runtime**: Node.js
- **Framework**: NestJS (Express-based)
- **Language**: TypeScript
- **ORM**: Prisma v6.16.1
- **Database**: PostgreSQL
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

### Key Dependencies

```json
{
  "@nestjs/core": "^10.x",
  "@nestjs/common": "^10.x",
  "@nestjs/jwt": "^10.x",
  "@nestjs/swagger": "^7.x",
  "@prisma/client": "^6.16.1",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x"
}
```

## 📁 Project Structure

```
edvance-backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   ├── common/                    # Shared utilities and services
│   │   ├── decorators/            # Custom decorators
│   │   ├── dto/                   # Common DTOs
│   │   ├── enums/                 # Enums
│   │   ├── guards/                # Authentication & authorization guards
│   │   ├── prisma/                # Prisma service
│   │   └── services/              # Common services
│   └── modules/                   # Feature modules
│       ├── database/              # Database utilities
│       ├── superadmin/            # Super admin module
│       │   ├── auth/              # Super admin authentication
│       │   └── school/            # School management
│       └── school/                # School-specific modules
│           ├── auth/              # School authentication
│           ├── student/           # Student management
│           ├── subject/           # Subject management
│           └── class/             # Class management
├── prisma/
│   └── schema.prisma              # Database schema
├── generated/
│   └── prisma/                    # Generated Prisma client
├── docs/                          # Documentation
└── test/                          # Test files
```

## 🏗 Architecture Patterns

### 1. Module-Based Architecture

Each feature is organized as a NestJS module with:

- **Module** (`*.module.ts`): Dependency injection container
- **Controller** (`*.controller.ts`): HTTP request handlers
- **Service** (`*.service.ts`): Business logic
- **DTOs** (`dto/*.dto.ts`): Data transfer objects
- **Entities** (Prisma models): Database entities

### 2. Layered Architecture

```
┌─────────────────────────────────┐
│     Controllers (HTTP Layer)    │
├─────────────────────────────────┤
│     Services (Business Logic)   │
├─────────────────────────────────┤
│     Prisma (Data Access Layer)  │
├─────────────────────────────────┤
│     PostgreSQL (Database)       │
└─────────────────────────────────┘
```

### 3. Authentication & Authorization Flow

```
Request → JWT Guard → Roles Guard → Controller → Service → Database
```

## 📦 Module Organization

### Common Module (`src/common/`)

Global utilities and services shared across all modules.

#### Key Components:

- **PrismaService**: Database connection and query execution
- **TokenService**: JWT token generation and validation
- **Guards**:
  - `JwtAuthGuard`: JWT authentication
  - `CustomJwtGuard`: Custom JWT with school context
  - `RolesGuard`: Role-based authorization
- **Decorators**:
  - `@Roles()`: Define required roles for endpoints
- **Enums**:
  - `UserRole`: User role types
  - `UserStatus`: User status types

### SuperAdmin Module (`src/modules/superadmin/`)

Manages super admin operations and school creation.

#### Sub-modules:

- **Auth**: Super admin authentication
- **School**: School CRUD operations

### School Module (`src/modules/school/`)

School-specific features and management.

#### Sub-modules:

- **Auth**: School user authentication
- **Student**: Student management
- **Subject**: Subject management
- **Class**: Class management
- **Teacher**: (To be implemented)

## 📝 Code Style Guidelines

### 1. Naming Conventions

#### Files

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Modules: `*.module.ts`
- DTOs: `*.dto.ts`
- Guards: `*.guard.ts`
- Decorators: `*.decorator.ts`

#### Classes

- PascalCase: `StudentController`, `StudentService`
- DTOs: `CreateStudentDto`, `UpdateStudentDto`, `StudentResponseDto`

#### Variables & Functions

- camelCase: `findAll()`, `createStudent()`, `schoolId`

### 2. Controller Pattern

```typescript
@ApiTags('Resource Name')
@ApiBearerAuth()
@Controller('resource-path')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create resource' })
  @ApiResponse({ status: 201, description: 'Success', type: ResponseDto })
  create(@Body() dto: CreateDto): Promise<ResponseDto> {
    return this.resourceService.create(dto);
  }
}
```

### 3. Service Pattern

```typescript
@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDto): Promise<ResponseDto> {
    // Validation
    const existing = await this.prisma.resource.findFirst({
      where: {
        /* conditions */
      },
    });

    if (existing) {
      throw new ConflictException('Resource already exists');
    }

    // Business logic
    return this.prisma.resource.create({
      data: dto,
    });
  }

  async findAll(filters: FilterDto): Promise<ResponseDto[]> {
    return this.prisma.resource.findMany({
      where: {
        /* filters */
      },
    });
  }
}
```

### 4. DTO Pattern

```typescript
// Create DTO
export class CreateResourceDto {
  @ApiProperty({ description: 'Field description', example: 'Example' })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  optionalField?: string;
}

// Update DTO
export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

// Response DTO
export class ResourceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  field: string;

  @ApiProperty()
  createdAt: Date;
}
```

### 5. Module Pattern

```typescript
@Module({
  imports: [
    PrismaModule,
    // Other required modules
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService], // If needed by other modules
})
export class ResourceModule {}
```

## 🔐 Authentication & Authorization

### JWT Payload Structure

```typescript
interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  schoolId?: string; // For school users
}
```

### Guard Usage

#### JWT Authentication

```typescript
@UseGuards(JwtAuthGuard)
```

#### Role-Based Authorization

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_STAFF)
```

#### Custom JWT with School Context

```typescript
@UseGuards(CustomJwtGuard)
```

## 🗄 Database Conventions

### Prisma Schema Patterns

1. **Model Naming**: PascalCase singular (e.g., `Student`, `Subject`)
2. **Field Naming**: camelCase
3. **Database Mapping**: snake_case using `@map()`
4. **Table Naming**: snake_case plural using `@@map()`
5. **Schema**: All models use `@@schema("public")`

### Example Model

```prisma
model Student {
  id          String   @id @default(uuid())
  firstName   String   @map("first_name")
  lastName    String   @map("last_name")
  schoolId    String   @map("school_id")
  school      School   @relation(fields: [schoolId], references: [id])

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("students")
  @@schema("public")
}
```

## 🚀 API Conventions

### URL Structure

- Base URL: `http://localhost:3000/api/v1`
- Resource paths: `/api/v1/resource-name`
- Nested resources: `/api/v1/parent/child`

### HTTP Methods

- `POST`: Create new resource
- `GET`: Retrieve resource(s)
- `PATCH`: Partial update
- `PUT`: Full update
- `DELETE`: Remove resource

### Response Status Codes

- `200 OK`: Successful GET, PATCH, PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists

## 📚 Additional Resources

- [API Examples](./api-examples/)
- [Module Documentation](./modules/)
- [Architecture Details](./architecture/)
