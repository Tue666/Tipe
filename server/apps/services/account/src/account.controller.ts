import { Controller, EventPattern, Payload } from '@pihe-core/common';
import { IAccount } from '@pihe-server/models';
import { AccountService } from './account.service';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @EventPattern('sign-in')
  signIn(@Payload() body: IAccount.SignInBody) {
    this.accountService.signIn(body);
  }
}
