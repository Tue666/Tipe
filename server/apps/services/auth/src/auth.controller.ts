import { Controller, Ctx, MessagePattern, Payload, RmqContext } from '@pihe-core/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'generate-token' })
  generateToken(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService.generateToken(data);
  }
}
