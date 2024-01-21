import { Injectable } from '@pihe-core/common';
import { AbstractClientCore } from '@pihe-core/client-core';
import { RedisClientConfig } from './redis-client.config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisClientService extends AbstractClientCore<RedisClientConfig, RedisClientType> {
  constructor() {
    super('redis');
  }

  private async connect(
    config: RedisClientConfig,
    callback: (client: RedisClientType) => void
  ): Promise<RedisClientType> {
    const { host, port } = config;

    const connectionString = `redis://${host}:${port}`;
    const connectOptions = { url: connectionString, ...config };

    const client = createClient(connectOptions);
    callback(client as RedisClientType);
    return (await client.connect()) as RedisClientType;
  }

  protected async init(config: RedisClientConfig): Promise<RedisClientType> {
    const callback = (client: RedisClientType) => {
      client.on('error', (error) => {
        console.log('Error when connecting to database', error);
      });
    };

    return await this.connect(config, callback);
  }

  protected async start(client: RedisClientType, conId?: string): Promise<void> {}

  protected async stop(client: RedisClientType, conId?: string): Promise<void> {}
}
