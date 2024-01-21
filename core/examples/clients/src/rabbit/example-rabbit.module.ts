import { Module } from '@pihe-core/common';
import { RabbitClientModule } from '@pihe-core/rabbit-client';
import { ExampleRabbitService } from './example-rabbit.service';

@Module({
  imports: [RabbitClientModule],
  providers: [ExampleRabbitService],
})
export class ExampleRabbitModule {}
