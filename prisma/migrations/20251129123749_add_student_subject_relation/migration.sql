/*
  Warnings:

  - A unique constraint covering the columns `[code,school_id]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'SCHOOL_TEACHER';

-- DropIndex
DROP INDEX "public"."subjects_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_school_id_key" ON "public"."subjects"("code", "school_id");
