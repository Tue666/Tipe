import { ConfigService, Injectable, Transport } from '@pihe-core/common';

export const SERVICE_NAMES = {
  account: {
    name: 'ACCOUNT_SERVICE',
    service: 'account',
  },
  auth: {
    name: 'AUTH_SERVICE',
    service: 'auth',
  },
};

@Injectable()
export class ApiGatewayConfig {
  constructor(private configService: ConfigService) {}

  getApiGatewayConfig() {
    const apiGatewayConfig = this.configService.get('apiGateway');
    return {
      port: parseInt(apiGatewayConfig.port),
    };
  }

  getServiceConfig(service: string) {
    const serviceConfigs = this.configService.get('services');
    const config = serviceConfigs[service];
    return this.buildConfig(config);
  }

  buildConfig(config) {
    const configs = {
      RMQ: this.buildRMQConfig(config),
    };
    return configs[config.transport];
  }

  buildRMQConfig(config) {
    const rabbit = this.configService.get('rabbit');
    return {
      port: parseInt(config.port),
      transport: Transport.RMQ,
      options: {
        urls: [rabbit?.host ?? 'amqp://localhost'],
        queue: config?.queue ?? '',
        prefetchCount: parseInt(config?.prefetchCount ?? 1),
        noAck: JSON.parse(config?.noAck ?? false),
      },
    };
  }
}
