import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfigService {
  constructor(private configService: ConfigService) {}

  getApiGatewayConfig() {
    return {
      port: parseInt(this.configService.get('API_GATEWAY_PORT')),
    };
  }

  getAuthServiceConfig() {
    return {
      port: parseInt(this.configService.get('AUTH_SERVICE_PORT')),
      options: {
        urls: [this.configService.get('RABBIT_HOST') || 'amqp://localhost'],
        queue: this.configService.get('AUTH_SERVICE_QUEUE') || '',
        prefetchCount: parseInt(this.configService.get('AUTH_SERVICE_PREFETCH_COUNT')) || 1,
        noAck: JSON.parse(this.configService.get('AUTH_SERVICE_NO_ACK')) || false,
      },
    };
  }

  getUserServiceConfig() {
    return {
      port: parseInt(this.configService.get('USER_SERVICE_PORT')),
      options: {
        urls: [this.configService.get('RABBIT_HOST') || 'amqp://localhost'],
        queue: this.configService.get('USER_SERVICE_QUEUE') || '',
        prefetchCount: parseInt(this.configService.get('USER_SERVICE_PREFETCH_COUNT')) || 1,
        noAck: JSON.parse(this.configService.get('USER_SERVICE_NO_ACK')) || false,
      },
    };
  }
}
