import {
  Injectable,
  Inject,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.log(context.switchToHttp().getRequest());
    return next.handle();
  }

  private log(req: any) {
    const body: any = { ...req.body };
    delete body.password;
    delete body.passwordConfirmation;
    const user: User = (req as any).user;
    const userEmail: string = user ? user.email : null;
    this.logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.route.path,
      data: {
        body: body,
        query: req.query,
        params: req.params,
      },
      from: req.ip,
      madeBy: userEmail,
    });
  }
}
