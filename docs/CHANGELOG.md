# Changelog

All notable changes to the Edvance Backend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive documentation structure in `/docs` folder
- `CODEBASE_OVERVIEW.md` - Complete project structure and architecture guide
- `MODULE_DEVELOPMENT_GUIDE.md` - Step-by-step guide for creating new modules
- `API_EXAMPLES.md` - Request/response examples for all endpoints
- `CHANGELOG.md` - Project change tracking

### Changed

- **2025-11-29**: Updated Prisma client import path in `PrismaService`
  - Changed from `@prisma/client` to `../../../generated/prisma`
  - Reason: Custom Prisma client output location configured in schema.prisma
- **2025-11-29**: Updated `CommonModule` to export `JwtModule`
  - Added `JwtModule` to exports array
  - Reason: Modules using `JwtAuthGuard` need access to `JwtService`
- **2025-11-29**: Updated Subject controller route
  - Changed from `@Controller('subjects')` to `@Controller('school/subjects')`
  - Reason: Maintain consistent URL structure for school-related resources

- **2025-11-29**: Updated JWT secret in `JwtAuthGuard`
  - Changed from `JWT_SECRET` to `JWT_ACCESS_SECRET`
  - Reason: Align with environment variable naming convention

### Fixed

- **2025-11-29**: Fixed Prisma client initialization error
  - Error: "@prisma/client did not initialize yet"
  - Solution: Updated import path to match custom output location
- **2025-11-29**: Fixed JwtAuthGuard dependency injection error in ClassModule
  - Error: "Nest can't resolve dependencies of the JwtAuthGuard"
  - Solution: Exported JwtModule from CommonModule

## [0.1.0] - 2025-11-29

### Project Structure

#### Modules Implemented

- **SuperAdmin Module**
  - Authentication (signup, signin, refresh token)
  - School Management (CRUD operations)
- **School Module**
  - Authentication (signin, refresh token)
  - Student Management (CRUD with parent relations)
  - Subject Management (CRUD operations)
  - Class Management (basic CRUD)
  - Teacher Management (CRUD with profile and user creation)

#### Common Services

- `PrismaService` - Database connection and queries
- `TokenService` - JWT token generation and validation
- `JwtAuthGuard` - JWT authentication guard
- `CustomJwtGuard` - Custom JWT guard with school context
- `RolesGuard` - Role-based authorization guard

#### Database Schema

- User management with role-based access
- School multi-tenancy support
- Student management with parent relations
- Subject and class management
- Comprehensive audit trails (createdBy, updatedBy, timestamps)

### API Endpoints

#### SuperAdmin

- `POST /api/v1/superadmin/auth/signup` - Super admin registration
- `POST /api/v1/superadmin/auth/signin` - Super admin login
- `POST /api/v1/superadmin/auth/refresh` - Refresh access token
- `POST /api/v1/superadmin/school/create` - Create new school
- `GET /api/v1/superadmin/school/all` - Get all schools
- `GET /api/v1/superadmin/school/one/:id` - Get school by ID
- `PATCH /api/v1/superadmin/school/update/:id` - Update school
- `DELETE /api/v1/superadmin/school/delete/:id` - Delete school

#### School

- `POST /api/v1/school/auth/signin` - School user login
- `POST /api/v1/school/auth/refresh` - Refresh access token

#### Students

- `POST /api/v1/school/student/create` - Create student with parents
- `GET /api/v1/school/student` - Get all students (with pagination & filters)
- `GET /api/v1/school/student/:id` - Get student by ID
- `PATCH /api/v1/school/student/:id` - Update student
- `DELETE /api/v1/school/student/:id` - Delete student

#### Subjects

- `POST /api/v1/school/subjects` - Create subject
- `GET /api/v1/school/subjects` - Get all subjects
- `GET /api/v1/school/subjects/:id` - Get subject by ID
- `PUT /api/v1/school/subjects/:id` - Update subject
- `DELETE /api/v1/school/subjects/:id` - Delete subject

#### Teachers

- `POST /api/v1/school/teachers` - Create teacher
- `GET /api/v1/school/teachers` - Get all teachers
- `GET /api/v1/school/teachers/:id` - Get teacher by ID
- `PATCH /api/v1/school/teachers/:id` - Update teacher
- `DELETE /api/v1/school/teachers/:id` - Delete teacher

#### Classes

- `POST /api/v1/classes` - Create class
- `GET /api/v1/classes/:id` - Get class by ID

### Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption
- Refresh token mechanism
- Multi-tenant data isolation

### Code Quality

- TypeScript strict mode enabled
- ESLint configuration
- Prettier code formatting
- Class-validator for DTO validation
- Swagger/OpenAPI documentation

## Upcoming Features

### Teacher Module (Planned)

- Teacher CRUD operations
- Teacher-subject assignments
- Teacher-class assignments
- Teacher attendance tracking

### Additional Planned Features

- Parent portal
- Fee management
- Attendance system
- Examination system
- Timetable management
- Communication module
- Reports and analytics

## Migration Notes

### Database Migrations

All database changes are tracked through Prisma migrations in the `prisma/migrations` folder.

To apply migrations:

```bash
npx prisma migrate dev
```

To generate Prisma client:

```bash
npx prisma generate
```

## Breaking Changes

None yet - this is the initial release.

## Contributors

- Development Team

## Notes

- This project uses Prisma with a custom output directory (`generated/prisma`)
- All imports of Prisma client should use the relative path to the generated folder
- The project follows NestJS best practices and conventions
- Multi-tenancy is implemented at the database level with schoolId foreign keys
