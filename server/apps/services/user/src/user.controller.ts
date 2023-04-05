import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @EventPattern('sign-up')
  signUp(@Payload() data) {
    this.userService.signUp(data);
  }
}
