import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config, ServerConfigService } from './config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  providers: [ServerConfigService],
  exports: [ServerConfigService],
})
export class CommonModule {}
