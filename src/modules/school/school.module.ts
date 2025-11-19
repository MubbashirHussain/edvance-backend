import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SchoolAuthModule } from './auth/school-auth.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    CommonModule,
    StudentModule,
    SchoolAuthModule,
  ],
  providers: [],
  exports: [SchoolAuthModule],
})
export class SchoolModule { }
