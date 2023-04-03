import { Module } from '@nestjs/common';
import { CommonModule } from '@pihe-server/common';
import { UserController } from './user.controller';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
})
export class UserModule {}
