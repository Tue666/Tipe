import { Module } from '@nestjs/common';
import { CommonModule } from '@pihe-server/common';
import { UserController } from './user.controller';
import { MongoClientModule } from '@pihe-core/mongo-client';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule, MongoClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
