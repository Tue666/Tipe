import { Module } from '@nestjs/common';
import { CommonModule as CoreCommonModule } from '@pihe-core/common';
import { CommonModule } from '@pihe-server/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [CoreCommonModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
