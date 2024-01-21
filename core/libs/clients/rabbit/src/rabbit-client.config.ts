import { ClientConfig } from '@pihe-core/client-core';

export class RabbitClientConfig extends ClientConfig {
  protocol: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  vhost?: string;

  constructor(props: RabbitClientConfig) {
    super(props);

    this.protocol = props.protocol;
    this.host = props.host;
    this.port = props.port;
    this.username = props?.username;
    this.password = props?.password;
    this.vhost = props.vhost;
  }
}
