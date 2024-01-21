import { Injectable, OnModuleInit } from '@pihe-core/common';
import { RabbitClientService } from '@pihe-core/rabbit-client';

@Injectable()
export class ExampleRabbitService implements OnModuleInit {
  constructor(private rabbitClientService: RabbitClientService) {}

  async onModuleInit() {
    await this.doSomething();
  }

  async doSomething() {
    const channel = await this.rabbitClientService.getClient().createChannel();
    await channel.assertQueue('test_rabbit_client_core');
    channel.sendToQueue('test_rabbit_client_core', Buffer.from('hehe'));
  }
}
