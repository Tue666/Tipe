import { Module } from '@nestjs/common';
import { CommonModule as CoreCommonModule } from '@pihe-core/common';
import { CommonModule } from '@pihe-server/common';
import { AccountController } from './account.controller';
import { MongoClientModule } from '@pihe-core/mongo-client';
import { AccountService } from './account.service';

@Module({
  imports: [CoreCommonModule, CommonModule, MongoClientModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
