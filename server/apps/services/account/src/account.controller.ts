import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { IAccount } from '@pihe-server/common';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @MessagePattern({ cmd: 'sign-in' })
  signIn(@Payload() data: IAccount.SignInPayload, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.accountService.signIn(data);
  }

  @MessagePattern({ cmd: 'sign-up' })
  signUp(@Payload() data: IAccount.SignUpPayload, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.accountService.signUp(data);
  }
}
