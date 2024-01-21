import { HttpAdapterHost, NestFactory } from '@pihe-core/common';
import { ApiGatewayConfig } from './config';
import { ApiGatewayModule } from './api-gateway.module';
import { RpcExceptionFilter } from './rpc-exception-filter';

const bootstrap = async () => {
  const app = await NestFactory.create(ApiGatewayModule);
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new RpcExceptionFilter(adapterHost));
  const config = app.get(ApiGatewayConfig);
  const apiGatewayConfig = config.getApiGatewayConfig();
  const PORT = apiGatewayConfig.port;
  await app.listen(PORT, () => {
    console.log(`Api Gateway running on port ${PORT}`);
  });
};

bootstrap();
