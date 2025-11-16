import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperadminModule } from './modules/superadmin/superadmin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SuperadminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
