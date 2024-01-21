import _ from 'lodash';
import { OnModuleInit, ConfigService, Inject, OnModuleDestroy } from '@pihe-core/common';
import { ClientConfig, DEFAULT_CON_ID } from './client.config';

export abstract class AbstractClientCore<Config extends ClientConfig, Client>
  implements OnModuleInit, OnModuleDestroy
{
  private configs: { [conId: string]: Config } = {};
  private clients: { [conId: string]: Client } = {};
  @Inject()
  private configService: ConfigService;

  constructor(private service: string) {}

  async onModuleInit() {
    const config = this.configService.get(this.service);
    if (_.isEmpty(config)) {
      console.log(`Config [${this.service}] not found`);
      return;
    }

    const conIds = Object.keys(config);
    if (conIds.find((conId) => conId === 'default') !== undefined) {
      // Init multiple client by connection id
      for (let i = 0; i < conIds.length; i++) {
        const conId = conIds[i];
        await this.clientInit({ conId, ...config[conId] });
      }
      return;
    }

    await this.clientInit({ conId: DEFAULT_CON_ID, ...config });
  }

  private async clientInit(config: Config) {
    const { conId } = config;
    if (!this.validateConfig(config)) {
      console.log(`Config [${conId}-${this.service}] validation failed`);
      return;
    }

    this.configs[conId] = config;
    this.clients[conId] = await this.init(this.configs[conId]);
    await this.start(this.clients[conId], conId);
  }

  private validateConfig(config: Config): boolean {
    // Implement validation config here
    return true;
  }

  async onModuleDestroy() {
    Object.keys(this.clients).forEach(async (conId) => await this.stop(this.clients[conId], conId));
  }

  getConfig(conId = DEFAULT_CON_ID): Config {
    return this.configs[conId];
  }

  getClient(conId = DEFAULT_CON_ID): Client {
    return this.clients[conId];
  }

  protected abstract init(config: Config): Promise<Client>;

  protected abstract start(client: Client, conId?: string): Promise<void>;

  protected abstract stop(client: Client, conId?: string): Promise<void>;
}
