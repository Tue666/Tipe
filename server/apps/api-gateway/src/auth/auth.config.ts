import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ServerConfigService } from '@pihe-server/common';

export const AuthConfig: ClientsProviderAsyncOptions = {
  name: 'AUTH_SERVICE',
  useFactory: (configService: ServerConfigService) => ({
    transport: Transport.RMQ,
    options: configService.getAuthServiceConfig().options,
  }),
  inject: [ServerConfigService],
};
