import { Module } from '@nestjs/common';
import { SuperAdminAuthService } from './auth/superadmin-auth.service';
import { CommonModule } from '../../common/common.module';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  imports: [CommonModule],
  providers: [SuperAdminAuthService, PrismaService],
  exports: [SuperAdminAuthService],
})
export class SuperAdminModule {}
