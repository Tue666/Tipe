import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ServerConfigService } from '@pihe-server/common';

export const UserConfig: ClientsProviderAsyncOptions = {
  name: 'USER_SERVICE',
  useFactory: (configService: ServerConfigService) => {
    const configs = configService.getServicesConfig();
    const { user } = configs;
    return {
      transport: Transport.RMQ,
      options: user.options,
    };
  },
  inject: [ServerConfigService],
};
