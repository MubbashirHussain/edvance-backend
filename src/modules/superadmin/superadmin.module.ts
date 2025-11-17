import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SuperAdminAuthModule } from './auth/superadmin-auth.module';

@Module({
  imports: [
    CommonModule,
    SuperAdminAuthModule,
  ],
  exports: [SuperAdminAuthModule],
})
export class SuperAdminModule {}
