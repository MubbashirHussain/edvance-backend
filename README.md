# Edvance Backend

A comprehensive school management system backend API built with NestJS, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

Edvance Backend is a robust, scalable school management system API that provides comprehensive features for managing schools, students, teachers, classes, subjects, and more. Built with modern technologies and best practices, it offers a solid foundation for educational institutions.

## ✨ Features

### Current Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Refresh token mechanism
  - Multi-tenant support

- 🏫 **School Management**
  - School CRUD operations
  - Multi-school support
  - School-specific configurations
  - Module-based permissions

- 👨‍🎓 **Student Management**
  - Student CRUD operations
  - Parent-student relationships
  - Student profiles with comprehensive data
  - Pagination and filtering

- 📚 **Subject Management**
  - Subject CRUD operations
  - School-specific subjects
  - Subject-class associations

- 🏛 **Class Management**
  - Class CRUD operations
  - Teacher assignments
  - Student enrollment
  - Class schedules

### Upcoming Features

- 👨‍🏫 Teacher Management
- 👪 Parent Portal
- 💰 Fee Management
- 📊 Attendance System
- 📝 Examination System
- 📅 Timetable Management
- 💬 Communication Module
- 📈 Reports & Analytics

## 🛠 Technology Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 6.16.1
- **Authentication**: JWT
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Runtime**: Node.js

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd edvance-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/edvance"
   DIRECT_URL="postgresql://user:password@localhost:5432/edvance"
   JWT_ACCESS_SECRET="your-access-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   PORT=3000
   NODE_ENV=development
   ```

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

The API will be available at `http://localhost:3000/api/v1`

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Codebase Overview](./docs/CODEBASE_OVERVIEW.md)** - Complete project structure and architecture guide
- **[Module Development Guide](./docs/MODULE_DEVELOPMENT_GUIDE.md)** - Step-by-step guide for creating new modules
- **[API Examples](./docs/api-examples/API_EXAMPLES.md)** - Request/response examples for all endpoints
- **[Changelog](./docs/CHANGELOG.md)** - Project change tracking

## 📁 Project Structure

```
edvance-backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── common/                    # Shared utilities and services
│   │   ├── decorators/            # Custom decorators
│   │   ├── dto/                   # Common DTOs
│   │   ├── enums/                 # Enums
│   │   ├── guards/                # Authentication & authorization guards
│   │   ├── prisma/                # Prisma service
│   │   └── services/              # Common services
│   └── modules/                   # Feature modules
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
├── docs/                          # Documentation
└── test/                          # Test files
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### SuperAdmin

- `POST /superadmin/auth/signup` - Super admin registration
- `POST /superadmin/auth/signin` - Super admin login
- `POST /superadmin/school/create` - Create new school
- `GET /superadmin/school/all` - Get all schools

### School Authentication

- `POST /school/auth/signin` - School user login
- `POST /school/auth/refresh` - Refresh access token

### Students

- `POST /school/student/create` - Create student
- `GET /school/student` - Get all students (with pagination)
- `GET /school/student/:id` - Get student by ID
- `PATCH /school/student/:id` - Update student
- `DELETE /school/student/:id` - Delete student

### Subjects

- `POST /school/subjects` - Create subject
- `GET /school/subjects` - Get all subjects
- `GET /school/subjects/:id` - Get subject by ID
- `PUT /school/subjects/:id` - Update subject
- `DELETE /school/subjects/:id` - Delete subject

### Classes

- `POST /classes` - Create class
- `GET /classes/:id` - Get class by ID

For detailed API examples with request/response payloads, see [API Examples](./docs/api-examples/API_EXAMPLES.md).

## 💻 Development

### Available Scripts

```bash
# Development
npm run start:dev        # Start development server with hot reload

# Production
npm run build           # Build for production
npm run start:prod      # Start production server

# Database
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run migrations in development
npx prisma studio       # Open Prisma Studio (database GUI)

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run e2e tests
npm run test:cov        # Run tests with coverage
```

### Code Style Guidelines

This project follows NestJS best practices and conventions:

- **Controllers**: Handle HTTP requests, delegate to services
- **Services**: Contain business logic
- **DTOs**: Use class-validator for validation
- **Guards**: Handle authentication and authorization
- **Modules**: Organize related features

For detailed guidelines, see [Codebase Overview](./docs/CODEBASE_OVERVIEW.md).

### Creating a New Module

Follow the step-by-step guide in [Module Development Guide](./docs/MODULE_DEVELOPMENT_GUIDE.md) to create new modules following established patterns.

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- `SUPER_ADMIN` - Full system access
- `SCHOOL_ADMIN` - School-level administration
- `SCHOOL_STAFF` - School staff operations
- `SCHOOL_TEACHER` - Teacher-specific access
- `SCHOOL_STUDENT` - Student-specific access
- `SCHOOL_PARENT` - Parent-specific access

## 🗄 Database

This project uses Prisma ORM with PostgreSQL. The database schema is defined in `prisma/schema.prisma`.

### Key Models

- **User** - System users with role-based access
- **School** - School entities with multi-tenant support
- **Student** - Student profiles and information
- **Parent** - Parent/guardian information
- **Subject** - Academic subjects
- **Class** - Class/grade management
- **Teacher** - Teacher profiles (upcoming)

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Development Team - Edvance Backend

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Inspired by modern school management needs

---

For more information, please refer to the [documentation](./docs/) or open an issue.
