/* eslint-disable prettier/prettier */
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ReturnUserDto } from 'src/common/dto/ReturnUserDto';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }
}
