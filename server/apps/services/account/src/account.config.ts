export const CONFIG_KEY = 'serviceConfig';

export class AccountConfig {
  hashRounds: number;

  constructor(props: AccountConfig) {
    this.hashRounds = props.hashRounds || 10;
  }
}
