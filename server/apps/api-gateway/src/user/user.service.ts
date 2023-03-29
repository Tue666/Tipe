import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  signUp() {
    const data = {
      id: 1,
      name: 'Tipe',
    };
    return this.userClient.send({ cmd: 'sign-up' }, JSON.stringify(data));
  }
}
