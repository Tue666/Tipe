import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ServerConfigService } from '@pihe-server/common';

export const UserConfig: ClientsProviderAsyncOptions = {
  name: 'USER_SERVICE',
  useFactory: (configService: ServerConfigService) => ({
    transport: Transport.RMQ,
    options: configService.getUserServiceConfig().options,
  }),
  inject: [ServerConfigService],
};
