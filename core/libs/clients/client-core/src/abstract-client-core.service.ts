import { OnModuleInit, ConfigService, Inject } from '@pihe-core/common';
import { ClientConfig } from './client.config';

export abstract class AbstractClientCore<Config extends ClientConfig, C> implements OnModuleInit {
  private configs: { [id: string]: Config } = {};
  private clients: { [id: string]: C } = {};
  @Inject()
  private configService: ConfigService;

  constructor(private service: string) {}

  async onModuleInit() {
    const config = this.configService.get(this.service);
    await this.clientInit(config);
  }

  async clientInit(config: Config) {
    const { id } = config;
    this.configs[id] = config;
    this.clients[id] = await this.init(this.configs[id]);
    await this.start(this.clients[id], id);
  }

  protected abstract init(config: Config): Promise<C>;

  protected abstract stop(client: C, id?: string): Promise<void>;

  protected abstract start(client: C, id?: string): Promise<void>;
}
