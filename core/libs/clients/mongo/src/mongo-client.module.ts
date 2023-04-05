import { Global, Module } from '@pihe/common';
import { ClientCoreModule } from '@pihe/client-core';
import { MongoClientService } from './mongo-client.service';

@Global()
@Module({
  imports: [ClientCoreModule],
  providers: [MongoClientService],
  exports: [MongoClientService],
})
export class MongoClientModule {}
