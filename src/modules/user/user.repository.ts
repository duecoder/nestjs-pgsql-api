/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';
import { UserRole } from 'src/shared/UserRole';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { CredentialsDto } from 'src/common/dto/CredentialsDto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password } = createUserDto;

    const user = new User();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      const savedUser = await this.save(user); 
      delete savedUser.password;
      delete savedUser.salt;
      return savedUser;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados'
        );
      }
    }
  }

  public async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ where: { email, status: true } });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  public async findUserById(userId: string): Promise<User> {
    const user = await this.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({ where: { email: email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
