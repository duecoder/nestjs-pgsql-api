import { createParamDecorator } from '@nestjs/common';
import { User } from '../../modules/user/user.entity';

export const GetUser = createParamDecorator((data, req): User => {
  const user: User = req.args[0].user;
  return user;
});
