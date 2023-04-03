import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '@pihe-server/common';
import { AuthConfig, AuthController, AuthService } from './auth';
import { UserConfig, UserController, UserService } from './user';

@Module({
  imports: [CommonModule, ClientsModule.registerAsync([AuthConfig, UserConfig])],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class ApiGatewayModule {}
