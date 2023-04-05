import { Injectable } from '@nestjs/common';
import { UserModel } from './models';

@Injectable()
export class UserService {
  async signUp(data) {
    const user = new UserModel(JSON.parse(data));
    await user.save();
    console.log('created');
  }
}
