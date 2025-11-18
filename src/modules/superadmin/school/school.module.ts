
import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { CommonModule } from '../../../common/common.module';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  imports: [CommonModule],
  controllers: [SchoolController],
  providers: [SchoolService , PrismaService],
})
export class SchoolModule {}
