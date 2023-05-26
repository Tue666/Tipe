import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '@pihe-server/common';
import { AuthConfig, AuthController, AuthService } from './auth';
import { AccountConfig, AccountController, AccountService } from './account';

@Module({
  imports: [CommonModule, ClientsModule.registerAsync([AuthConfig, AccountConfig])],
  controllers: [AuthController, AccountController],
  providers: [AuthService, AccountService],
})
export class ApiGatewayModule {}
