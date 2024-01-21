import {
  BadRequestException,
  ConfigService,
  HttpStatus,
  Injectable,
  NotFoundException,
  RpcException,
} from '@pihe-core/common';
import { AccountModel, AdministratorModel, CustomerModel, Types } from './models';
import bcrypt from 'bcrypt';
import { AccountConfig, CONFIG_KEY } from './account.config';

@Injectable()
export class AccountService {
  constructor(private configService: ConfigService) {}

  private get accountConfig() {
    return new AccountConfig(this.configService.get(CONFIG_KEY));
  }

  async signIn(data: any) {
    const { phone_number, password } = data;
    const account = await AccountModel.findOne({ phone_number });
    if (!account) {
      throw new RpcException(new NotFoundException('Account not found!'));
    }

    const isRightPassword = await bcrypt.compare(password, account.password);
    if (!isRightPassword) {
      throw new RpcException(new BadRequestException('Sign in information is incorrect!'));
    }

    const payload = {
      _id: account._id,
      name: account.name,
      account_type: account.account_type,
    };
    return {
      statusCode: HttpStatus.OK,
      payload,
    };
  }

  async signUp(data: any) {
    const { phone_number, password, passwordConfirm, account_type, ...rest } = data;
    let account = await AccountModel.findOne({ phone_number });
    if (account) {
      throw new RpcException(new BadRequestException('Account already existed!'));
    }

    if (password !== passwordConfirm) {
      throw new RpcException(new BadRequestException('Passwords does not sync!'));
    }

    const hashedPassword = await bcrypt.hash(password, this.accountConfig.hashRounds);
    const document = {
      ...rest,
      phone_number,
      password: hashedPassword,
    };

    switch (account_type) {
      case Types.customer:
        account = new CustomerModel(document);
        break;
      case Types.administrator:
        account = new AdministratorModel(document);
        break;
      default:
        throw new RpcException(
          new NotFoundException(`Unable to resolve, type of ${account_type} not matched any!`)
        );
    }
    await account.save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Account created!',
    };
  }
}
