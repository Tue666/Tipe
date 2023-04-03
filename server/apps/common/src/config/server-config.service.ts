import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfigService {
  constructor(private configService: ConfigService) {}

  getApiGatewayConfig() {
    return {
      port: this.configService.get<number>('API_GATEWAY_PORT'),
    };
  }

  getAuthServiceConfig() {
    return {
      port: this.configService.get<number>('AUTH_SERVICE_PORT'),
      options: {
        urls: [this.configService.get<string>('RABBIT_HOST') || 'amqp://localhost'],
        queue: this.configService.get<string>('AUTH_SERVICE_QUEUE') || '',
        // prefetchCount: this.configService.get<number>('AUTH_SERVICE_PREFETCH_COUNT') || 1,
        // noAck: this.configService.get<boolean>('AUTH_SERVICE_NO_ACK') || false,
      },
    };
  }

  getUserServiceConfig() {
    return {
      port: this.configService.get<number>('USER_SERVICE_PORT'),
      options: {
        urls: [this.configService.get<string>('RABBIT_HOST') || 'amqp://localhost'],
        queue: this.configService.get<string>('USER_SERVICE_QUEUE') || '',
        // prefetchCount: this.configService.get<number>('USER_SERVICE_PREFETCH_COUNT') || 1,
        // noAck: this.configService.get<boolean>('USER_SERVICE_NO_ACK') || false,
      },
    };
  }
}
