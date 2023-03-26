import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AuthService {
  constructor(@Inject("AUTH_SERVICE") private authClient: ClientProxy) {}

  create() {
    const data = {
      id: 1,
      name: "Tipe",
    };
    return this.authClient.emit("create", JSON.stringify(data));
  }
}
