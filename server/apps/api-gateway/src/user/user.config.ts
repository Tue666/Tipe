import { ClientsProviderAsyncOptions } from '@nestjs/microservices';
import { ConfigService } from '@pihe/common';
import { userOptions } from '../configs/queues';

export const UserConfig: ClientsProviderAsyncOptions = {
  name: 'USER_SERVICE',
  useFactory: userOptions,
  inject: [ConfigService],
};
