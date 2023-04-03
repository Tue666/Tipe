import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ServerConfigService } from '@pihe-server/common';

const bootstrap = async () => {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ServerConfigService);
  const configs = configService.getApiGatewayConfig();
  const PORT = configs.port;
  await app.listen(PORT, () => {
    console.log(`Api Gateway running on port ${PORT}`);
  });
};

bootstrap();
