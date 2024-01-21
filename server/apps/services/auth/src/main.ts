import { MicroserviceOptions, NestFactory } from '@pihe-core/common';
import { ApiGatewayConfig, SERVICE_NAMES } from '@pihe-server/api-gateway';
import { AuthModule } from './auth.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ApiGatewayConfig);
  const authConfig = config.getServiceConfig(SERVICE_NAMES.auth.service);
  const PORT = authConfig.port;
  await app.connectMicroservice<MicroserviceOptions>({
    transport: authConfig.transport,
    options: authConfig.options,
  });
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
};

bootstrap();
