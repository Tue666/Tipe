import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { AuthConfig } from "./auth/auth.config";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CommonModule } from "@pihe/common";

@Module({
  imports: [CommonModule, ClientsModule.registerAsync([AuthConfig])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class ApiGatewayModule {}
