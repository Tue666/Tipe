import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  @EventPattern('sign-up')
  signUp(@Payload() data) {
    console.log(data);
  }
}
