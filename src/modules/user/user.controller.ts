/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ReturnUserDto } from 'src/common/dto/ReturnUserDto';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../auth/role.decorator';
import { UserRole } from 'src/shared/UserRole';
import { RolesGuard } from '../auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
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
