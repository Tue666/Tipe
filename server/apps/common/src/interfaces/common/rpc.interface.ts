export interface RpcResponse<T> {
  statusCode: number;
  payload: T;
}
