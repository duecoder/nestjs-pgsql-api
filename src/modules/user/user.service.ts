/* eslint-disable prettier/prettier */
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';
import { User } from './user.entity';
import { UserRole } from 'src/shared/UserRole';

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
}
