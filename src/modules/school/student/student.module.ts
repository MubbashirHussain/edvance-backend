import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CommonModule } from '../../../common/common.module';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Module({
    imports: [CommonModule],
    controllers: [StudentController],
    providers: [StudentService, PrismaService],
    exports: [StudentService],
})
export class StudentModule { }
