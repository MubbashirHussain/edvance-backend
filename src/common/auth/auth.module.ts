import { Module } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { CommonModule } from '../common.module';
import { CustomJwtGuard } from '../guards/custom-jwt.guard';

@Module({
  imports: [CommonModule],
  providers: [CustomJwtGuard, RolesGuard],
  exports: [CustomJwtGuard, RolesGuard],
})
export class AuthModule {}
