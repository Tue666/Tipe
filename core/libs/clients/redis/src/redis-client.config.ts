import { ClientConfig } from '@pihe-core/client-core';

export class RedisClientConfig extends ClientConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  name?: string;
  database?: number;
  commandsQueueMaxLength?: number;
  readonly?: boolean;
  legacyMode?: boolean;

  constructor(props: RedisClientConfig) {
    super(props);

    this.host = props.host;
    this.port = props.port;
    this.username = props?.username;
    this.password = props?.password;
    this.name = props?.name;
    this.database = props?.database;
    this.commandsQueueMaxLength = props?.commandsQueueMaxLength;
    this.readonly = props?.readonly;
    this.legacyMode = props?.legacyMode;
  }
}
