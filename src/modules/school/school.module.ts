import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SchoolAuthModule } from './auth/school-auth.module';

@Module({
  imports: [
    CommonModule,
    SchoolAuthModule,
  ],
  providers: [],
  exports: [SchoolAuthModule],
})
export class SchoolModule {}
