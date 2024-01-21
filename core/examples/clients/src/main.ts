import { bootstrap } from '@pihe-core/common';
import { ExampleClientsModule } from './example-clients.module';

(async () => {
  await bootstrap(ExampleClientsModule);
})();
