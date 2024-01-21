import { Module } from '@pihe-core/common';
import { MongoClientModule } from '@pihe-core/mongo-client';
import { ExampleMongoService } from './example-mongo.service';

@Module({
  imports: [MongoClientModule],
  providers: [ExampleMongoService],
})
export class ExampleMongoModule {}
