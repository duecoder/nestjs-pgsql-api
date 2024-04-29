/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { ReturnUserDto } from 'src/common/dto/ReturnUserDto';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../auth/role.decorator';
import { UserRole } from 'src/shared/UserRole';
import { RolesGuard } from '../auth/roles.guard';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
    if (!validateUUID(id)) {
      throw new BadRequestException('ID inválido. O ID deve ser um UUID válido.');
    }

    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      user,
      message: 'Usuário encontrado.',
    };
  }
}
