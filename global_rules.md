# Project Rules & Approach: Edvance Backend

## Project Overview
- **Name**: edvance
- **Tech Stack**: NestJS, Prisma, PostgreSQL, Supabase (optional)
- **Validation**: class-validator, class-transformer
- **Auth**: JWT via TokenService
- **Response Format**: ResponseService

## Project Structure
### Root
- Config files: .env, .gitignore, README.md, package.json, nest-cli.json, tsconfig.json
- Output: generated/prisma

### Source (`src/`)
- Entry: `main.ts`
- Core: `app.module.ts`, `app.controller.ts`, `app.service.ts`

### Common (`src/common/`)
- Config: `env.config.ts`
- Services: `token.service.ts`, `encryption.service.ts`, `response.service.ts`
- Utils: `validation.utils.ts`
- Middleware: `auth.middleware.ts`, `admin.middleware.ts`

### Modules
- **Auth**: `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`
- **Config**: `prisma.module.ts`, `supabase.module.ts`

## Environment Variables
### Required
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

### Optional
- `JWT_EXPIRES_IN`
- `SUPABASE_URL`
- `SUPABASE_KEY`

## Database (Prisma)
- **Datasource**: PostgreSQL
- **Models**: Users, UserPreferences, Donations, Volunteers, HelpRequests, Causes
- **Enums**: DonationType, DonationStatus, PaymentStatus, Status, AvailabilityStatus, MediaType
- **Behavior**: Connect on init, disconnect on destroy

## Coding Conventions
1. **Validation**: Use DTOs with `class-validator`.
2. **Controllers**: Keep them thin. Delegate logic to services.
3. **Config**: Use `EnvConfigService` instead of `process.env`.
4. **Responses**: Use `ResponseService` for normalized responses.
5. **Roles/Status**: Use enums.
6. **Source of Truth**: Prisma schema is the source of truth for data models.
7. **JWT**: Payload must contain `userId`, `email`, `role`.

## Setup & Replication
1. Install deps: `npm ci`
2. Configure `.env`
3. Run `npx prisma generate`
4. Run migrations/seed
5. Start app

## Example Workflows
- **Auth Signup**: POST `/auth/signup` -> Validate DTO -> Create User+Prefs -> Return Summary
- **Auth Signin**: POST `/auth/signin` -> Validate DTO -> Verify Password -> Issue Token -> Return Response
