import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../../app/service/auth.service';
import { CreateUserDto } from 'src/app/common/dto/create-user.dto';
import { CredentialsDto } from 'src/app/common/dto/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../modules/user/user.entity';
import { GetUser } from '../../app/decorator/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  public async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.signUp(createUserDto);
    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Post('/signin')
  public async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.signIn(credentiaslsDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  public getMe(@GetUser() user: User): User {
    return user;
  }
}
