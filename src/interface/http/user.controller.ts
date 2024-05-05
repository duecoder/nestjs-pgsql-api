/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { ReturnUserDto } from 'src/app/common/dto/return-user.dto';
import { UserService } from '../../app/service/user.service';
import { CreateUserDto } from 'src/app/common/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../app/decorator/role.decorator';
import { UserRole } from 'src/shared/UserRole';
import { RolesGuard } from '../../app/guard/roles.guard';
import { UpdateUserDto } from 'src/app/common/dto/update-user.dto';
import { GetUser } from 'src/app/decorator/get-user.decorator';
import { User } from 'src/modules/user/user.entity';
import { FindUsersQueryDto } from 'src/modules/user/find-users-query.dto';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  public async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    
    return {
      user,
      message: 'Administrador cadastrado com sucesso',
    };
  }

  @Get('/id/:id')
  @Role(UserRole.ADMIN)
  public async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
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

  @Get('/email/:email')
  @Role(UserRole.ADMIN)
  public async findUserByEmail(@Param('email') email: string): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      user,
      message: 'Usuário encontrado.',
    };
  }

  @Patch(':id')
  public async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param(':id') id: string,
  ) {
    if (user.role != UserRole.ADMIN && user.id && user.id.toString() != id) {
      throw new ForbiddenException('Você não tem autorização para acessar esse recurso')
    } else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  public async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return {
      message: 'Usuário removido com sucesso',
    }
  }

  @Get()
  @Role(UserRole.ADMIN)
  public async findUsers(@Query() query: FindUsersQueryDto) {
    const found = await this.usersService.findUsers(query);
    return {
      found, 
      message: 'Usuários encontrados',
    }
  }
}
