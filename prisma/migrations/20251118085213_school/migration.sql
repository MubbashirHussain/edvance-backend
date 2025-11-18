-- CreateEnum
CREATE TYPE "public"."SchoolStatus" AS ENUM ('ACTIVE', 'TRIAL', 'PAUSED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."SchoolPlan" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "school_id" TEXT;

-- CreateTable
CREATE TABLE "public"."schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logo_url" TEXT,
    "favicon_url" TEXT,
    "primary_color" TEXT,
    "secondary_color" TEXT,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "country" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "plan" "public"."SchoolPlan" NOT NULL DEFAULT 'FREE',
    "status" "public"."SchoolStatus" NOT NULL DEFAULT 'TRIAL',
    "billing_cycle" "public"."BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "allow_students_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_teachers_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_parent_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_fee_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_attendance_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_exams_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_time_table_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_communication_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_reports_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_settings_module" BOOLEAN NOT NULL DEFAULT false,
    "allow_user_management_module" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "public"."schools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "schools_domain_key" ON "public"."schools"("domain");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
