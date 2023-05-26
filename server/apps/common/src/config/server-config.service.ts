import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfigService {
  constructor(private configService: ConfigService) {}

  getApiGatewayConfig() {
    const apiGatewayConfig = this.configService.get('apiGateway');
    return {
      port: parseInt(apiGatewayConfig.port),
    };
  }

  getServicesConfig() {
    const rabbitHost = this.configService.get('rabbitHost');
    const servicesConfig = this.configService.get('services');
    const { auth, account } = servicesConfig;
    return {
      auth: {
        port: parseInt(auth.port),
        options: {
          urls: [rabbitHost || 'amqp://localhost'],
          queue: auth.queue || '',
          prefetchCount: parseInt(auth.prefetchCount) || 1,
          noAck: JSON.parse(auth.noAck) || false,
        },
      },
      account: {
        port: parseInt(account.port),
        options: {
          urls: [rabbitHost || 'amqp://localhost'],
          queue: account.queue || '',
          prefetchCount: parseInt(account.prefetchCount) || 1,
          noAck: JSON.parse(account.noAck) || false,
        },
      },
    };
  }
}
