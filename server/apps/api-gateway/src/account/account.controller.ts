import { Body, Controller, Post } from '@pihe-core/common';
import { AccountService } from './account.service';
// import { IAccount } from '@pihe-server/common';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  // @Post('/sign-in')
  // async signIn(@Body() body: IAccount.SignInPayload) {
  //   return await this.accountService.signIn(body);
  // }

  // @Post('/sign-up')
  // async signUp(@Body() body: IAccount.SignUpPayload) {
  //   return await this.accountService.signUp(body);
  // }
}
