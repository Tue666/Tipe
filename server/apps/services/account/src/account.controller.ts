import { Controller, Ctx, MessagePattern, Payload, RmqContext } from '@pihe-core/common';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @MessagePattern({ cmd: 'sign-in' })
  signIn(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.accountService.signIn(data);
  }

  @MessagePattern({ cmd: 'sign-up' })
  signUp(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.accountService.signUp(data);
  }
}
