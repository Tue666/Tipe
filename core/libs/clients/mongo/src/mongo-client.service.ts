import { Injectable } from '@pihe-core/common';
import { AbstractClientCore } from '@pihe-core/client-core';
import { MongoClientConfig } from './mongo-client.config';
import { MongoClient } from './mongo.client';
import { connect } from 'mongoose';

@Injectable()
export class MongoClientService extends AbstractClientCore<MongoClientConfig, MongoClient> {
  constructor() {
    super('mongo');
  }

  async connect(config: MongoClientConfig) {
    const connectionString = `mongodb://zxc?authSource=admin`;
    return await connect(connectionString, {});
  }

  protected async init(config: MongoClientConfig): Promise<MongoClient> {
    await this.connect(config);
    return null;
  }

  protected start(client: MongoClient, id?: string): Promise<void> {
    console.log('start mongo client', client, id);
    return;
  }

  protected stop(client: MongoClient, id?: string): Promise<void> {
    return;
  }
}
