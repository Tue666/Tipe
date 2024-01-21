import { ClientsProviderAsyncOptions } from '@pihe-core/common';
import { ApiGatewayConfig, SERVICE_NAMES } from '../config';

export const AuthConfig: ClientsProviderAsyncOptions = {
  name: SERVICE_NAMES.auth.name,
  inject: [ApiGatewayConfig],
  useFactory: (apiGatewayConfig: ApiGatewayConfig) => {
    const { transport, options } = apiGatewayConfig.getServiceConfig(SERVICE_NAMES.auth.service);
    return { transport, options };
  },
};
