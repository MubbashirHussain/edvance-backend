import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { CommonModule } from '../../../common/common.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CustomJwtGuard } from '../../../common/guards/custom-jwt.guard';

@Module({
  imports: [CommonModule],
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService, CustomJwtGuard],
})
export class SchoolModule {}
