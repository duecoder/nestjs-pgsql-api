import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/shared/UserRole';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  name: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}
