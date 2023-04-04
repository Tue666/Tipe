import { NestFactory } from '@nestjs/core';
import { MongoClientModule } from './mongo-client.module';

const bootstrap = async () => {
  const app = await NestFactory.create(MongoClientModule);
  await app.listen(10000, () => {
    console.log(`Api Gateway running on port ${10000}`);
  });
};

bootstrap();
