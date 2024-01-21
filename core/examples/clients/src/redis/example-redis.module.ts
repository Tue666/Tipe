import { Module } from '@pihe-core/common';
import { RedisClientModule } from '@pihe-core/redis-client';
import { ExampleRedisService } from './example-redis.service';

@Module({
  imports: [RedisClientModule],
  providers: [ExampleRedisService],
})
export class ExampleRedisModule {}
