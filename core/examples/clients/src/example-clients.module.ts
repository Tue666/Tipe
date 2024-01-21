import { Module } from '@pihe-core/common';
import { ExampleMongoModule } from './mongo/example-mongo.module';
import { ExampleRabbitModule } from './rabbit/example-rabbit.module';
import { ExampleRedisModule } from './redis/example-redis.module';

@Module({
  imports: [
    // ExampleMongoModule,
    // ExampleRabbitModule,
    // ExampleRedisModule
  ],
})
export class ExampleClientsModule {}
