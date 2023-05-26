import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ServerConfigService } from '@pihe-server/common';
import { RpcExceptionFilter } from './rpc-exception-filter';

const bootstrap = async () => {
  const app = await NestFactory.create(ApiGatewayModule);
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new RpcExceptionFilter(adapterHost));
  const configService = app.get(ServerConfigService);
  const configs = configService.getApiGatewayConfig();
  const PORT = configs.port;
  await app.listen(PORT, () => {
    console.log(`Api Gateway running on port ${PORT}`);
  });
};

bootstrap();
