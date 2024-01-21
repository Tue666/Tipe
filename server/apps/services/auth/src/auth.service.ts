import { ConfigService, Injectable } from '@pihe-core/common';
import jwt from 'jsonwebtoken';
import { AuthConfig, CONFIG_KEY } from './auth.config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  private get authConfig() {
    const a = this.configService.get(CONFIG_KEY);
    return new AuthConfig(this.configService.get(CONFIG_KEY));
  }

  generateToken(data: any) {
    const accessToken = jwt.sign(data, this.authConfig.secretSignature, {
      expiresIn: this.authConfig.secretExpire,
    });
    const refreshToken = jwt.sign(data, this.authConfig.refreshSecretSignature, {
      expiresIn: this.authConfig.refreshSecretExpire,
    });
    return { accessToken, refreshToken };
  }
}
