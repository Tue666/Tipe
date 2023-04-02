import { ClientsProviderAsyncOptions } from '@nestjs/microservices';
import { ConfigService } from '@pihe/common';
import { authOptions } from '../configs/queues';

export const AuthConfig: ClientsProviderAsyncOptions = {
  name: 'AUTH_SERVICE',
  useFactory: authOptions,
  inject: [ConfigService],
};
