import { Module } from '@pihe-core/common';
import { ClientCoreModule } from '@pihe-core/client-core';
import { MongoClientService } from './mongo-client.service';

@Module({
  imports: [ClientCoreModule],
  providers: [MongoClientService],
})
export class MongoClientModule {}
