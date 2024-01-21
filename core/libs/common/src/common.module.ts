import { ConfigService, Global, Module } from './common';
import { ConfigModule } from './common';
import { config } from './config';

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
