import { Module } from '@nestjs/common';
import { SchoolAuthController } from './school-auth.controller';
import { SchoolAuthService } from './school-auth.service';
import { CommonModule } from '../../../common/common.module';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Module({
  imports: [CommonModule],
  controllers: [SchoolAuthController],
  providers: [SchoolAuthService, PrismaService],
  exports: [SchoolAuthService],
})
export class SchoolAuthModule {}
