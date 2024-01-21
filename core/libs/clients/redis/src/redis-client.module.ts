import { Global, Module } from '@pihe-core/common';
import { ClientCoreModule } from '@pihe-core/client-core';
import { RedisClientService } from './redis-client.service';

@Global()
@Module({
  imports: [ClientCoreModule],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
