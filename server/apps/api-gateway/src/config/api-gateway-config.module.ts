import { CommonModule, Global, Module } from '@pihe-core/common';
import { ApiGatewayConfig } from './api-gateway.config';

@Global()
@Module({
  imports: [CommonModule],
  providers: [ApiGatewayConfig],
  exports: [ApiGatewayConfig],
})
export class ApiGatewayConfigModule {}
