import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ServerConfigService } from '@pihe-server/common';

export const AccountConfig: ClientsProviderAsyncOptions = {
  name: 'ACCOUNT_SERVICE',
  useFactory: (configService: ServerConfigService) => {
    const configs = configService.getServicesConfig();
    const { account } = configs;
    return {
      transport: Transport.RMQ,
      options: account.options,
    };
  },
  inject: [ServerConfigService],
};
