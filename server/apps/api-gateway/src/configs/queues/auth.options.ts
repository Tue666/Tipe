import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@pihe/common';

export const authOptions = (configService: ConfigService): RmqOptions => {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_HOST') || 'amqp://localhost'],
      queue: configService.get<string>('AUTH_QUEUE') || '',
    },
  };
};
