import { MicroserviceOptions, NestFactory } from '@pihe-core/common';
import { ApiGatewayConfig, SERVICE_NAMES } from '@pihe-server/api-gateway';
import { AccountModule } from './account.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AccountModule);
  const config = app.get(ApiGatewayConfig);
  const accountConfig = config.getServiceConfig(SERVICE_NAMES.account.service);
  const PORT = accountConfig.port;
  await app.connectMicroservice<MicroserviceOptions>({
    transport: accountConfig.transport,
    options: accountConfig.options,
  });
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`Account service running on port ${PORT}`);
  });
};

bootstrap();
