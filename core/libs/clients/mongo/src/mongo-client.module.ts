import { Global, Module } from '@pihe-core/common';
import { ClientCoreModule } from '@pihe-core/client-core';
import { MongoClientService } from './mongo-client.service';

@Global()
@Module({
  imports: [ClientCoreModule],
  providers: [MongoClientService],
  exports: [MongoClientService],
})
export class MongoClientModule {}
