import { ClientProxy, Inject, Injectable } from '@pihe-core/common';
import { IAccount } from '@pihe-server/models';
import { SERVICE_NAMES } from '../config';

@Injectable()
export class AccountService {
  constructor(@Inject(SERVICE_NAMES.account.name) private accountServiceClient: ClientProxy) {}

  signIn(body: IAccount.SignInBody) {
    this.accountServiceClient.emit<any, string>('sign-in', 'Han');
  }
}
