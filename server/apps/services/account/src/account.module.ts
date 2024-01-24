import { Module } from '@pihe-core/common';
import { ApiGatewayConfigModule } from '@pihe-server/api-gateway';

@Module({
  imports: [ApiGatewayConfigModule],
  controllers: [],
  providers: [],
})
export class AccountModule {}
