import { ClientsModule, CommonModule, Module } from '@pihe-core/common';
import { ApiGatewayConfigModule, ApiGatewayConfig } from './config';
import { AuthConfig, AuthController, AuthService } from './auth';
import { AccountConfig, AccountController, AccountService } from './account';

@Module({
  imports: [
    CommonModule,
    ApiGatewayConfigModule,
    ClientsModule.registerAsync([AuthConfig, AccountConfig]),
  ],
  controllers: [AuthController, AccountController],
  providers: [ApiGatewayConfig, AuthService, AccountService],
})
export class ApiGatewayModule {}
