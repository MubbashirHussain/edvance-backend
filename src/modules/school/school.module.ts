import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SchoolAuthModule } from './auth/school-auth.module';
import { StudentModule } from './student/student.module';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [
    CommonModule,
    StudentModule,
    SchoolAuthModule,
    ClassModule,
    SubjectModule,
  ],
  providers: [],
  exports: [
    SchoolAuthModule,
    ClassModule,
    SubjectModule,
  ],
})
export class SchoolModule { }
