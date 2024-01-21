import { Inject, Injectable } from '@pihe-core/common';
import { ClientProxy } from '@nestjs/microservices';
// import { IAccount, ICommon } from '@pihe-server/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountService {
  // constructor(
  //   @Inject('ACCOUNT_SERVICE') private accountClient: ClientProxy,
  //   @Inject('AUTH_SERVICE') private authClient: ClientProxy
  // ) {}
  // async signIn(body: IAccount.SignInPayload) {
  //   const pattern = {
  //     signIn: { cmd: 'sign-in' },
  //     generateTokens: { cmd: 'generate-token' },
  //   };
  //   const { payload } = await lastValueFrom(
  //     this.accountClient.send<ICommon.RpcResponse<any>>(pattern.signIn, body)
  //   );
  //   const tokens = await lastValueFrom(
  //     this.authClient.send<IAccount.Tokens>(pattern.generateTokens, payload)
  //   );
  //   return tokens;
  // }
  // async signUp(body: IAccount.SignUpPayload) {
  //   const pattern = { cmd: 'sign-up' };
  //   return await lastValueFrom(this.accountClient.send(pattern, body));
  // }
}
