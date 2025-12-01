# Documentation Index

Welcome to the Edvance Backend documentation! This index will help you find the information you need quickly.

## 📚 Documentation Structure

```
docs/
├── CODEBASE_OVERVIEW.md           # Complete project overview
├── MODULE_DEVELOPMENT_GUIDE.md    # How to create new modules
├── CHANGELOG.md                   # Project change history
├── api-examples/
│   └── API_EXAMPLES.md           # API request/response examples
├── modules/
│   └── EXISTING_MODULES.md       # Reference for existing modules
└── architecture/
    └── (Future architecture docs)
```

## 🎯 Quick Links

### For New Developers

1. Start with [Codebase Overview](./CODEBASE_OVERVIEW.md)
2. Review [Existing Modules](./modules/EXISTING_MODULES.md)
3. Check [API Examples](./api-examples/API_EXAMPLES.md)

### For AI Agents

1. Read [Codebase Overview](./CODEBASE_OVERVIEW.md) for project structure
2. Follow [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md) for creating modules
3. Reference [Existing Modules](./modules/EXISTING_MODULES.md) for patterns
4. Use [API Examples](./api-examples/API_EXAMPLES.md) for payload formats

### For API Consumers

1. Check [API Examples](./api-examples/API_EXAMPLES.md) for endpoints
2. Review authentication requirements
3. See example payloads and responses

## 📖 Document Summaries

### [CODEBASE_OVERVIEW.md](./CODEBASE_OVERVIEW.md)

**Purpose**: Comprehensive guide to project architecture and structure

**Contents**:

- Project information and tech stack
- Directory structure
- Architecture patterns
- Module organization
- Code style guidelines
- Authentication & authorization
- Database conventions
- API conventions

**When to use**:

- Understanding the overall project structure
- Learning the tech stack
- Understanding architectural decisions
- Setting up development environment

---

### [MODULE_DEVELOPMENT_GUIDE.md](./MODULE_DEVELOPMENT_GUIDE.md)

**Purpose**: Step-by-step guide for creating new modules

**Contents**:

- Prerequisites checklist
- Step-by-step module creation
- DTO patterns
- Service patterns
- Controller patterns
- Module registration
- Testing guidelines
- Common patterns (pagination, transactions, soft delete)
- Common pitfalls

**When to use**:

- Creating a new module
- Understanding module structure
- Learning best practices
- Implementing common features

---

### [EXISTING_MODULES.md](./modules/EXISTING_MODULES.md)

**Purpose**: Reference documentation for all existing modules

**Contents**:

- Student Module
- Subject Module
- Class Module
- SuperAdmin Auth Module
- School Management Module
- School Auth Module
- Common patterns across modules
- Module comparison table
- Best practices observed

**When to use**:

- Understanding existing module implementations
- Finding code examples
- Comparing different approaches
- Learning from existing patterns

---

### [API_EXAMPLES.md](./api-examples/API_EXAMPLES.md)

**Purpose**: Complete API reference with examples

**Contents**:

- Authentication guide
- School management endpoints
- Student management endpoints
- Subject management endpoints
- Class management endpoints
- Error response formats
- cURL examples

**When to use**:

- Testing API endpoints
- Understanding request/response formats
- Integrating with the API
- Debugging API issues

---

### [CHANGELOG.md](./CHANGELOG.md)

**Purpose**: Track all project changes and updates

**Contents**:

- Recent changes
- Bug fixes
- New features
- Breaking changes
- Migration notes

**When to use**:

- Understanding recent changes
- Tracking project evolution
- Planning upgrades
- Debugging version-specific issues

---

## 🔍 Finding Information

### By Topic

#### Authentication & Authorization

- [Codebase Overview - Authentication](./CODEBASE_OVERVIEW.md#authentication--authorization)
- [API Examples - Authentication](./api-examples/API_EXAMPLES.md#authentication)
- [Existing Modules - Auth Modules](./modules/EXISTING_MODULES.md#4-superadmin-auth-module)

#### Database & Prisma

- [Codebase Overview - Database Conventions](./CODEBASE_OVERVIEW.md#database-conventions)
- [Existing Modules - Prisma Queries](./modules/EXISTING_MODULES.md#3-prisma-queries)

#### Creating New Features

- [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md)
- [Existing Modules - Common Patterns](./modules/EXISTING_MODULES.md#common-patterns-across-modules)

#### API Usage

- [API Examples](./api-examples/API_EXAMPLES.md)
- [Codebase Overview - API Conventions](./CODEBASE_OVERVIEW.md#api-conventions)

#### Code Style

- [Codebase Overview - Code Style Guidelines](./CODEBASE_OVERVIEW.md#code-style-guidelines)
- [Module Development Guide - Code Style Checklist](./MODULE_DEVELOPMENT_GUIDE.md#code-style-checklist)

### By Role

#### Backend Developer

1. [Codebase Overview](./CODEBASE_OVERVIEW.md)
2. [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md)
3. [Existing Modules](./modules/EXISTING_MODULES.md)

#### Frontend Developer

1. [API Examples](./api-examples/API_EXAMPLES.md)
2. [Codebase Overview - API Conventions](./CODEBASE_OVERVIEW.md#api-conventions)

#### DevOps Engineer

1. [Codebase Overview - Project Structure](./CODEBASE_OVERVIEW.md#project-structure)
2. [README - Getting Started](../README.md#getting-started)

#### Project Manager

1. [README - Features](../README.md#features)
2. [Changelog](./CHANGELOG.md)

#### AI Agent

1. [Codebase Overview](./CODEBASE_OVERVIEW.md) - Understand structure
2. [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md) - Follow patterns
3. [Existing Modules](./modules/EXISTING_MODULES.md) - Reference implementations
4. [API Examples](./api-examples/API_EXAMPLES.md) - Payload formats

## 🎨 Code Examples

### Quick Reference

**Creating a new module**: [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md)

**DTO Pattern**:

```typescript
// See: Module Development Guide - Step 2
export class CreateResourceDto {
  @ApiProperty({ description: '...', example: '...' })
  @IsString()
  @IsNotEmpty()
  field: string;
}
```

**Service Pattern**:

```typescript
// See: Module Development Guide - Step 3
@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDto): Promise<ResponseDto> {
    // Implementation
  }
}
```

**Controller Pattern**:

```typescript
// See: Module Development Guide - Step 4
@Controller('resource')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN)
  create(@Body() dto: CreateDto) {
    return this.service.create(dto);
  }
}
```

## 🔄 Keeping Documentation Updated

When making changes to the codebase:

1. **New Module**: Update [Existing Modules](./modules/EXISTING_MODULES.md)
2. **API Changes**: Update [API Examples](./api-examples/API_EXAMPLES.md)
3. **Architecture Changes**: Update [Codebase Overview](./CODEBASE_OVERVIEW.md)
4. **Bug Fixes/Features**: Update [Changelog](./CHANGELOG.md)
5. **New Patterns**: Update [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md)

## 📞 Getting Help

If you can't find what you're looking for:

1. Check the [README](../README.md)
2. Search this documentation
3. Review [Existing Modules](./modules/EXISTING_MODULES.md) for similar implementations
4. Check the [Changelog](./CHANGELOG.md) for recent changes
5. Open an issue in the repository

## 🚀 Next Steps

### For New Team Members

1. ✅ Read [README](../README.md)
2. ✅ Review [Codebase Overview](./CODEBASE_OVERVIEW.md)
3. ✅ Set up development environment
4. ✅ Explore [Existing Modules](./modules/EXISTING_MODULES.md)
5. ✅ Try [API Examples](./api-examples/API_EXAMPLES.md)
6. ✅ Create a test module using [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md)

### For AI Agents Creating New Features

1. ✅ Read [Codebase Overview](./CODEBASE_OVERVIEW.md) to understand structure
2. ✅ Review [Existing Modules](./modules/EXISTING_MODULES.md) for similar implementations
3. ✅ Follow [Module Development Guide](./MODULE_DEVELOPMENT_GUIDE.md) step-by-step
4. ✅ Use [API Examples](./api-examples/API_EXAMPLES.md) for payload formats
5. ✅ Update [Changelog](./CHANGELOG.md) with changes made

---

**Last Updated**: 2025-11-29

**Documentation Version**: 1.0.0
