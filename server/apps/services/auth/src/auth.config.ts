export const CONFIG_KEY = 'serviceConfig';

export class AuthConfig {
  secretSignature: string;
  secretExpire: number;
  refreshSecretSignature: string;
  refreshSecretExpire: number;

  constructor(props: AuthConfig) {
    this.secretSignature = props.secretSignature;
    this.secretExpire = props.secretExpire;
    this.refreshSecretSignature = props.refreshSecretSignature;
    this.refreshSecretExpire = props.refreshSecretExpire;
  }
}
