import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config, ConfigService } from './config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CommonModule {}
