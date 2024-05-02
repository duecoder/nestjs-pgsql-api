/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { CreateUserDto } from 'src/common/dto/CreateUserDto';
import { User } from '../user/user.entity';
import { UserRole } from 'src/shared/UserRole';
import { CredentialsDto } from 'src/common/dto/CredentialsDto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	public async signUp(createUserDto: CreateUserDto): Promise<User> {
		if (createUserDto.password != createUserDto.passwordConfirmation) {
			throw new UnprocessableEntityException('As senhas não conferem');
		} else {
			return await this.userRepository.createUser(createUserDto, UserRole.USER);
		}
	}

	public async signIn(credentialsDto: CredentialsDto) {
    	const user = await this.userRepository.checkCredentials(credentialsDto);

		if (user === null) {
			throw new UnauthorizedException('Credenciais inválidas');
		}
		const jwtPayload = { id: user.id, };
		
		const token = await this.jwtService.signAsync(jwtPayload);

		return { token };
  	}
}
