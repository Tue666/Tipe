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
    const { auth, user } = servicesConfig;
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
      user: {
        port: parseInt(user.port),
        options: {
          urls: [rabbitHost || 'amqp://localhost'],
          queue: user.queue || '',
          prefetchCount: parseInt(user.prefetchCount) || 1,
          noAck: JSON.parse(user.noAck) || false,
        },
      },
    };
  }
}
