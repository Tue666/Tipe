import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@pihe/common';

export const userOptions = (configService: ConfigService): RmqOptions => {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_HOST') || 'amqp://localhost'],
      queue: configService.get<string>('USER_QUEUE') || '',
      prefetchCount: configService.get<number>('PREFETCH_COUNT') || 1,
      noAck: configService.get<boolean>('NO_ACK') || false,
    },
  };
};
