
import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SuperAdminAuthModule } from './auth/superadmin-auth.module';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [
    CommonModule,
    SuperAdminAuthModule,
    SchoolModule,
  ],
  providers: [],
  exports: [SuperAdminAuthModule, SchoolModule],
})
export class SuperAdminModule {}

