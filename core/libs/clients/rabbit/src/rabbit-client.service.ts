import { Injectable } from '@pihe-core/common';
import { AbstractClientCore } from '@pihe-core/client-core';
import { RabbitClientConfig } from './rabbit-client.config';
import amqp from 'amqplib';

@Injectable()
export class RabbitClientService extends AbstractClientCore<RabbitClientConfig, amqp.Connection> {
  constructor() {
    super('rabbit');
  }

  async connect(
    config: RabbitClientConfig,
    callback: (client: amqp.Connection) => void
  ): Promise<amqp.Connection> {
    const connectOptions = { hostname: config.host, ...config };
    const client = await amqp.connect(connectOptions);
    callback(client);
    return client;
  }

  protected async init(config: RabbitClientConfig): Promise<amqp.Connection> {
    const callback = (client: amqp.Connection) => {};

    return await this.connect(config, callback);
  }

  protected async start(client: amqp.Connection, conId?: string): Promise<void> {}

  protected async stop(client: amqp.Connection, conId?: string): Promise<void> {}
}
