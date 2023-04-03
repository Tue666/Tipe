import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ServerConfigService } from '@pihe-server/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const bootstrap = async () => {
  const app = await NestFactory.create(UserModule);
  const configService = app.get(ServerConfigService);
  const configs = configService.getUserServiceConfig();
  const PORT = configs.port;
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: configs.options,
  });
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
};

bootstrap();
