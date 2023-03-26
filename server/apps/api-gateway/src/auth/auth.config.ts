import { ClientsProviderAsyncOptions, Transport } from "@nestjs/microservices";
import { CommonModule, ConfigService } from "@tipe/common";

export const AuthConfig: ClientsProviderAsyncOptions = {
  name: "AUTH_SERVICE",
  useFactory: async (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>("RABBIT_HOST") || "amqp://localhost"],
      queue: configService.get<string>("AUTH_QUEUE") || "",
    },
  }),
  inject: [ConfigService],
};
