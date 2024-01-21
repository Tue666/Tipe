import { ClientsProviderAsyncOptions } from '@pihe-core/common';
import { ApiGatewayConfig, SERVICE_NAMES } from '../config';

export const AccountConfig: ClientsProviderAsyncOptions = {
  name: SERVICE_NAMES.account.name,
  inject: [ApiGatewayConfig],
  useFactory: (configService: ApiGatewayConfig) => {
    const { transport, options } = configService.getServiceConfig(SERVICE_NAMES.account.service);
    return { transport, options };
  },
};
