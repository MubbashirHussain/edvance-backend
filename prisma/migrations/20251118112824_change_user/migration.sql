-- AlterTable
ALTER TABLE "public"."schools" ADD COLUMN     "created_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."schools" ADD CONSTRAINT "schools_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
