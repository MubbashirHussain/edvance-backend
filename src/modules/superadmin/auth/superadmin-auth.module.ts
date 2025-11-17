import { Module } from '@nestjs/common';
import { SuperAdminAuthController } from './superadmin-auth.controller';
import { SuperAdminAuthService } from './superadmin-auth.service';
import { CommonModule } from '../../../common/common.module';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Module({
  imports: [CommonModule],
  controllers: [SuperAdminAuthController],
  providers: [SuperAdminAuthService, PrismaService],
  exports: [SuperAdminAuthService],
})
export class SuperAdminAuthModule {}
