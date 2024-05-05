import { User } from 'src/modules/user/user.entity';

export class ReturnUserDto {
  user: User;
  message: string;
}
