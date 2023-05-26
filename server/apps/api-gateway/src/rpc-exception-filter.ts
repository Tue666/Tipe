import { ArgumentsHost, Catch, ExceptionFilter, HttpAdapterHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

interface RpcExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

class IRpcException extends RpcException {
  response: RpcExceptionResponse;

  constructor(props: IRpcException) {
    super(props.response.message);
    this.response = props.response;
  }
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: IRpcException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = exception.response;
    const statusCode = exception.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(ctx.getResponse(), response, statusCode);
  }
}
