import { Injectable, OnModuleInit } from '@pihe-core/common';
import { RedisClientService } from '@pihe-core/redis-client';

@Injectable()
export class ExampleRedisService implements OnModuleInit {
  constructor(private redisClientService: RedisClientService) {}

  async onModuleInit() {
    await this.doSomething();
  }

  async doSomething() {
    const res = await this.redisClientService.getClient().set('redis', '123');
    console.log(res);
  }
}
