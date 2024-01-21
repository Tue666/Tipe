import { Injectable, sleep } from '@pihe-core/common';
import { AbstractClientCore } from '@pihe-core/client-core';
import { MongoClientConfig } from './mongo-client.config';
import { Connection, connection, connect } from './mongo.client';

@Injectable()
export class MongoClientService extends AbstractClientCore<MongoClientConfig, Connection> {
  constructor() {
    super('mongo');
  }

  private connect(config: MongoClientConfig) {
    const { url, database, auth, autoIndex, autoCreate } = config;

    const connectionString = `mongodb://${url}`;
    const connectOptions = {};
    if (auth) {
      connectOptions['user'] = auth.username;
      connectOptions['pass'] = auth.password;
    }
    if (database) {
      connectOptions['dbName'] = database;
    }
    if (autoIndex) {
      connectOptions['autoIndex'] = autoIndex;
    }
    if (autoCreate) {
      connectOptions['autoCreate'] = autoCreate;
    }

    connect(connectionString, connectOptions);
  }

  protected async init(config: MongoClientConfig): Promise<Connection> {
    this.connect(config);

    connection.on('connected', () => {
      console.log('Connected to mongo database successfully');
    });

    connection.on('error', (error) => {
      console.log('Error when connecting to database', error);
    });

    connection.on('disconnected', async () => {
      console.log('Database connection disconnected');
      console.log('Database try reconnect, retrying...');

      await sleep(config.retryTimeout);

      this.connect(config);
    });

    return connection;
  }

  protected async start(client: Connection, conId?: string): Promise<void> {}

  protected async stop(client: Connection, conId?: string): Promise<void> {}
}
