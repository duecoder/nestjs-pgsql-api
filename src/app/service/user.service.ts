/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../modules/user/user.repository';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { User } from '../../modules/user/user.entity';
import { UserRole } from 'src/shared/UserRole';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { FindUsersQueryDto } from 'src/modules/user/find-users-query.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      return await this.userRepository.createUser(createUserDto, UserRole.ADMIN);
    }
  }

  public async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findUserById(userId);
  }

  public async findUserByEmail(userId: string): Promise<User> {
    return await this.userRepository.findUserByEmail(userId);
  }

  public async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user: User = await this.findUserById(id);
    const { name, email, role, status } = updateUserDto;
    user.name = name ? name: user.name;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status === undefined ? user.status : status;
    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar os dados no banco de dados');
    }
  }

  public async deleteUser(userId: string) {
    const result: DeleteResult = await this.userRepository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException('Não foi encontrado um usuário com o ID informado')
    }
  }

  public async findUsers(queryDto: FindUsersQueryDto): Promise<{ users: User[], total: number }> {
    const users: any = await this.userRepository.findUsers(queryDto);
    return users;
  }
}
