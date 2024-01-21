export const DEFAULT_CON_ID = 'default';

export class ClientConfig {
  conId: string;

  constructor(props: ClientConfig) {
    this.conId = props.conId;
  }
}
