import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorSendingMailException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_GATEWAY);
  }
}
