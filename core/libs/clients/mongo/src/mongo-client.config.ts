import { ClientConfig } from '@pihe-core/client-core';

class BasicAuthCredentials {
  username: string;
  password: string;

  constructor(props) {
    this.username = props.username;
    this.password = props.password;
  }
}

export class MongoClientConfig extends ClientConfig {
  url: string;
  database?: string;
  auth?: BasicAuthCredentials;
  autoIndex?: boolean;
  autoCreate?: boolean;
  retryTimeout: number;

  constructor(props: MongoClientConfig) {
    super(props);

    this.url = props.url;
    this.database = props?.database;
    this.auth = props?.auth;
    this.autoIndex = props?.autoIndex;
    this.autoCreate = props?.autoCreate;
    this.retryTimeout = props?.retryTimeout ?? 20000;
  }
}
