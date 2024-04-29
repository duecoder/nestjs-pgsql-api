/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';
import { User } from '../user/user.entity';
import { UserRole } from 'src/shared/UserRole';
import { CredentialsDto } from 'src/common/dto/CredentialsDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	async signUp(createUserDto: CreateUserDto): Promise<User> {
		if (createUserDto.password != createUserDto.passwordConfirmation) {
			throw new UnprocessableEntityException('As senhas não conferem');
		} else {
			return await this.userRepository.createUser(createUserDto, UserRole.USER);
		}
	}

	async signIn(credentialsDto: CredentialsDto) {
	
    const user = await this.userRepository.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

		const jwtPayload = {
      id: user.id,
    };
    const token = await this.jwtService.signAsync(jwtPayload);

    return { token };
  }
}
