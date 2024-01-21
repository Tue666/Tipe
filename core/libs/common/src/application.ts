import { NestFactory } from './common';

export const bootstrap = async (module: any) => {
  const app = await NestFactory.create(module);
  await app.listen(3000);
};
