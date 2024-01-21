import { Global, Module } from '@pihe-core/common';
import { ClientCoreModule } from '@pihe-core/client-core';
import { RabbitClientService } from './rabbit-client.service';

@Global()
@Module({
  imports: [ClientCoreModule],
  providers: [RabbitClientService],
  exports: [RabbitClientService],
})
export class RabbitClientModule {}
