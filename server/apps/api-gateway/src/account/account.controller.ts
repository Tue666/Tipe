import { Body, Controller, Post } from '@pihe-core/common';
import { IAccount } from '@pihe-server/models';
import { AccountService } from './account.service';

@Controller('api/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/sign-in')
  signIn(@Body() body: IAccount.SignInBody) {
    return this.accountService.signIn(body);
  }
}
