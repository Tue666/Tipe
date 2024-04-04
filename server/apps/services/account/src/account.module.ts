import { Module } from '@pihe-core/common';
import { ApiGatewayConfigModule } from '@pihe-server/api-gateway';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [ApiGatewayConfigModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
