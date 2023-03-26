import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "./config";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.development", ".env.staging", ".env.production"],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CommonModule {}
