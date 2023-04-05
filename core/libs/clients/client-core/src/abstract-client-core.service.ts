import { OnModuleInit, ConfigService, Inject, OnModuleDestroy } from '@pihe/common';
import { ClientConfig } from './client.config';

export abstract class AbstractClientCore<Config extends ClientConfig, Client>
  implements OnModuleInit, OnModuleDestroy
{
  private configs: { [id: string]: Config } = {};
  private clients: { [id: string]: Client } = {};
  @Inject()
  private configService: ConfigService;

  constructor(private service: string) {}

  async onModuleInit() {
    const config = this.configService.get(this.service);
    await this.clientInit(config);
  }

  async clientInit(config: Config) {
    this.configs[this.service] = config;
    this.clients[this.service] = await this.init(this.configs[this.service]);
    await this.start(this.clients[this.service], this.service);
  }

  async onModuleDestroy() {
    Object.values(this.clients).forEach(async (client) => await this.stop(client));
  }

  protected abstract init(config: Config): Promise<Client>;

  protected abstract start(client: Client, id?: string): Promise<void>;

  protected abstract stop(client: Client, id?: string): Promise<void>;
}
