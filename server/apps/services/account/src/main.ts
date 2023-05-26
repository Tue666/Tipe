import { NestFactory } from '@nestjs/core';
import { AccountModule } from './account.module';
import { ServerConfigService } from '@pihe-server/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const bootstrap = async () => {
  const app = await NestFactory.create(AccountModule);
  const configService = app.get(ServerConfigService);
  const configs = configService.getServicesConfig();
  const { account } = configs;
  const PORT = account.port;
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: account.options,
  });
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`Account service running on port ${PORT}`);
  });
};

bootstrap();
