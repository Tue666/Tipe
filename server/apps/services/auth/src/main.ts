import { NestFactory } from '@nestjs/core';
import { ServerConfigService } from '@pihe-server/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ServerConfigService);
  const configs = configService.getServicesConfig();
  const { auth } = configs;
  const PORT = auth.port;
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: auth.options,
  });
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
};

bootstrap();
