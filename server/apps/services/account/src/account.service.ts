import { Injectable } from '@pihe-core/common';
import { IAccount } from '@pihe-server/models';

@Injectable()
export class AccountService {
  signIn(body: IAccount.SignInBody) {
    console.log('Account service received: ', body);
  }
}
