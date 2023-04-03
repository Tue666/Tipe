import { resolve } from 'path';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServerConfigService } from './config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(__dirname, '..', '.env.development'),
        resolve(__dirname, '..', '.env.staging'),
        resolve(__dirname, '..', '.env.production'),
      ],
    }),
  ],
  providers: [ServerConfigService],
  exports: [ServerConfigService],
})
export class CommonModule {}
