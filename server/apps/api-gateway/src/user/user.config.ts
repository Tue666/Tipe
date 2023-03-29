import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@pihe/common';

export const UserConfig: ClientsProviderAsyncOptions = {
  name: 'USER_SERVICE',
  useFactory: async (configService: ConfigService) => {
    console.log(configService.get<string>('RABBIT_HOST'));
    return {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBIT_HOST') || 'amqp://localhost'],
        queue: configService.get<string>('USER_QUEUE') || '',
      },
    };
  },
  inject: [ConfigService],
};
