import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ServerConfigService } from '@pihe-server/common';

export const AuthConfig: ClientsProviderAsyncOptions = {
  name: 'AUTH_SERVICE',
  useFactory: (configService: ServerConfigService) => {
    const configs = configService.getServicesConfig();
    const { auth } = configs;
    return {
      transport: Transport.RMQ,
      options: auth.options,
    };
  },
  inject: [ServerConfigService],
};
