import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@pihe/common';

const bootstrap = async () => {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 9000;
  await app.listen(PORT, () => {
    console.log(`Api Gateway running on port ${PORT}`);
  });
};

bootstrap();
