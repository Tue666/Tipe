import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ConfigService } from '@pihe/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const bootstrap = async () => {
  const app = await NestFactory.create(UserModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 9002;
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBIT_HOST') || 'amqp://localhost'],
      queue: configService.get<string>('USER_QUEUE') || '',
      prefetchCount: configService.get<number>('PREFETCH_COUNT') || 1,
      noAck: configService.get<boolean>('NO_ACK') || false,
    },
  });
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
};

bootstrap();
